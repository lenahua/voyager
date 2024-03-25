var express = require("express");
var cors = require("cors");
var app = express();
var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var saltRounds = 10;

app.listen(8000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());

var mysql = require("mysql");
/* var connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "voyager_dev",
  charset: "utf8mb4",
}); */

var connection = mysql.createConnection({
  user: "root",
  password: "",
  host: "127.0.0.1",
  database: "test",
});

connection.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected");
  }
});
//圖檔格式轉換工具函式
//接收[{img:...},{img:...}],可將img內屬性二進制轉換為Base64編碼
//回傳轉換過物件內img屬性的陣列
let changeToBase64 = (result) => {
  for (let i = 0; i < result.length; i++) {
    let blobImageData = result[i].img;
    result[i].img = Buffer.from(blobImageData, "binary").toString("base64");
  }
  return result;
};

//找到特定貼文postid的所有照+資訊,回傳的是陣列
app.get("/viewPage/getModal", function (req, res) {
  connection.query(
    `SELECT post.postid,imgdata.img,post.title,
        post.postdate,post.postcontent,userinfo.account
        FROM imgdata,post,userinfo
        WHERE imgdata.postid  = post.postid 
        AND post.uid = userinfo.uid
        AND post.postid = ?`,
    [req.query.postid],
    function (err, result) {
      let newResult = changeToBase64(result);
      console.log(result);
      res.send(newResult);
    }
  );
});

//取得特定貼文postid的所有標籤
app.get("/viewPage/getTag", function (req, res) {
  connection.query(
    `
    SELECT tag 
    FROM posttag,post
    WHERE posttag.postid = post.postid
    AND posttag.postid = ?`,
    [req.query.postid],
    function (err, result) {
      res.send(result);
    }
  );
});

//取得所有貼文相關資訊
app.get("/viewPage/allPost", function (req, res) {
  connection.query(`SELECT * FROM post WHERE 1`, [], function (err, result) {
    res.send(result);
  });
});

//取得所有不同貼文的第一張照片
app.get("/viewPage/imgList", function (req, res) {
  connection.query(
    `SELECT MIN(id), postid, img 
        FROM imgdata 
        GROUP BY postid 
        ORDER BY postid DESC `,
    [],
    function (err, result) {
      result = changeToBase64(result);
      res.send(result);
    }
  );
});
//取得指定縣市的所有不同貼文的第一張圖片及該貼文的相關資訊
app.get("/viewPage/locationFilter", function (req, res) {
  connection.query(
    `
        SELECT *,min(imgdata.id) as firstPicId 
        FROM post,imgdata 
        WHERE location = ? AND
        post.postid = imgdata.postid
        GROUP BY imgdata.postid
        ORDER BY imgdata.postid DESC`,
    [req.query.lname],
    function (err, result) {
      result = changeToBase64(result);
      res.send(result);
    }
  );
});

//發布貼文留言=> 目前寫死留言都會是UID 3在留言 =>等登入功能
app.post(`/viewPage/postComment`, function (req, res) {
  connection.query(
    `
        INSERT INTO postcomment( postid, Uid,comment, likecounter, commenttime) 
        VALUES (?,3,?,0,NOW());`,
    [req.body.postid, req.body.commentText],
    function (err, result) {
      console.log(result);
      res.send(result);
    }
  );
});
//取得貼文所有留言內容
app.get(`/viewPage/getComment`, function (req, res) {
  connection.query(
    `
        SELECT * 
        FROM post,postcomment
        WHERE post.postid = postcomment.postid AND 
        post.postid = ?
        ORDER BY commenttime DESC`,
    [req.query.postid],
    function (err, result) {
      console.log(result);
      res.send(result);
    }
  );
});
//取得貼文留言總數
app.get(`/viewPage/getCommentCouner`, function (req, res) {
  connection.query(
    `
        SELECT COUNT(*) AS comment_counter
        FROM post,postcomment
        WHERE post.postid = postcomment.postid
        AND post.postid = ?`,
    [req.query.postid],
    function (err, result) {
      res.send(result);
    }
  );
});

//取得特定貼文的留言的使用者帳號(account)
app.get(`/viewPage/getCommentAccount`, function (req, res) {
  connection.query(
    `
        SELECT account 
        FROM post,postcomment,userinfo
        WHERE post.postid = postcomment.postid AND 
        postcomment.Uid = userinfo.Uid AND
        post.postid = ?
        ORDER BY commenttime DESC`,
    [req.query.postid],
    function (err, result) {
      res.send(result);
    }
  );
});
//取得貼文按讚狀態=>已點or未點
app.get(`/viewPage/getLikeState`, function (req, res) {
  connection.query(
    `
        SELECT count(*) as state
        FROM postliketable
        WHERE uid = ? AND
        postid = ?`,
    [req.query.uid, req.query.postid],
    function (err, result) {
      res.send(result);
    }
  );
});
//取消特定貼文的點讚
app.delete(`/viewPage/cancelLike`, function (req, res) {
  connection.query(
    `
        DELETE FROM postliketable WHERE uid = ?`,
    [req.query.uid],
    function (err, result) {
      res.send("cancel sucess");
    }
  );
});
//對特定貼文點讚
app.post(`/viewPage/addLike`, function (req, res) {
  connection.query(
    `
        INSERT INTO postliketable(postid,uid) VALUES (?,?)`,
    [req.query.postid, req.query.uid],
    function (err, result) {
      res.send("addLike sucess");
    }
  );
});
//取得特定貼文讚數
app.get(`/viewPage/getLikeCounter`, function (req, res) {
  connection.query(
    `
        SELECT COUNT(*) as likeCounter FROM postliketable WHERE postid = ?`,
    [req.query.postid],
    function (err, result) {
      res.send(result);
    }
  );
});

//取得特定貼文是否被收藏
app.get(`/viewPage/getSavingState`, function (req, res) {
  connection.query(
    `
        SELECT COUNT(*) as state
        FROM savinglist 
        WHERE postid = ? AND
        uid = ?`,
    [req.query.postid, req.query.uid],
    function (err, result) {
      res.send(result);
    }
  );
});
//對特定貼文取消收藏
app.delete(`/viewPage/deleteSavingState`, function (req, res) {
  connection.query(
    `
        DELETE FROM savinglist 
        WHERE postid = ? AND uid = ?`,
    [req.query.postid, req.query.uid],
    function (err, result) {
      res.send("cancle saving");
    }
  );
});

//對特定貼文增加收藏
app.post(`/viewPage/addSavingState`, function (req, res) {
  connection.query(
    `
        INSERT INTO savinglist( Uid, postId, categoryId, saveTime) 
        VALUES (?,?,?,NOW())`,
    [req.query.uid, req.query.postid, 8],
    function (err, result) {
      res.send("addLike sucess");
    }
  );
});

//LILY

/* app.get("/member/order/:id", function (req, res) {
  connection.query(
    "SELECT * FROM `orderinfo` WHERE Uid = ? ORDER BY startDate DESC;",
    [req.params.id],
    function (err, result) {
      if (err) {
        console.error("Error executing query: ", err);
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.send(result);
      }
    }
  );
}); */
app.get("/member/order/:id", function (req, res) {
  const sql = `
    SELECT 
      orderinfo.orderId, 
      orderinfo.Uid, 
      hotel.name, 
      orderinfo.startDate, 
      orderinfo.endDate, 
      orderinfo.price, 
      orderinfo.hotelId,
      (SELECT hotel_photos.photo_url 
    FROM hotel_photos 
    WHERE hotel_photos.hotel_id = hotel.hotel_id 
    ORDER BY hotel_photos.photo_id 
    LIMIT 1) AS photo_url
    FROM orderinfo 
    JOIN hotel ON orderinfo.hotelId = hotel.hotel_id 
    WHERE orderinfo.Uid = 10
    GROUP BY orderinfo.orderId, orderinfo.Uid, hotel.name, orderinfo.startDate, orderinfo.endDate, orderinfo.price, orderinfo.hotelId;
  `;
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) {
      console.error("Error executing query: ", err);
      res.status(500).send({ error: "Internal Server Error" });
    } else {
      res.send(result);
    }
  });
});
app.put("/member/info/basic/update/:id", function (req, res) {
  const userId = req.params.id;
  const newPassword = req.body.password;

  // 確保提供了新密碼
  if (!newPassword) {
    return res.status(400).send("Password is required");
  }

  const sql = `UPDATE userinfo SET password = ? WHERE Uid = ?`;
  connection.query(sql, [newPassword, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error updating password");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("User not found");
    }
    res.send("Password updated successfully");
  });
});

app.put("/member/info/basic/updateEmail/:id", function (req, res) {
  const userId = req.params.id;
  const newEmail = req.body.email;

  const sql = `UPDATE userinfo SET email = ? WHERE Uid = ?`;
  connection.query(sql, [newEmail, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error updating password");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("User not found");
    }
    res.send("Password updated successfully");
  });
});

//get member info by id
app.get("/member/info/basic/:id", function (req, res) {
  connection.query(
    "SELECT * FROM `userinfo` WHERE Uid = ?",
    [req.params.id],
    function (err, result) {
      if (err) {
        console.error("Error executing query: ", err);
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/member/info/card/:id", function (req, res) {
  connection.query(
    "SELECT * FROM `creditcard` WHERE Uid = ?",
    [req.params.id],
    function (err, result) {
      if (err) {
        console.error("Error executing query: ", err);
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/member/info/card/:id", (req, res) => {
  const { Uid, cardNumber, cardType, valid, cvv } = req.body;

  // 將 "MM/YY" 格式的有效日期轉換為 "YYYY-MM-DD"，假設有效期到該月的最後一天
  // 假设 valid 是 "0323" 这样的格式，没有 "/"
  const month = valid.substring(0, 2);
  const year = `20${valid.substring(2)}`;

  // 设置为下个月的第0天，JavaScript 会自动调整为当前月的最后一天
  const lastDay = new Date(year, month, 0).getDate();

  // 构造 YYYY-MM-DD 格式的日期字符串
  const validDate = `${year}-${month}-${lastDay}`;

  const sql = `INSERT INTO creditcard (Uid, cardNumber, cardType, valid, cvv) VALUES (?, ?, ?, ?, ?)`;

  connection.query(
    sql,
    [Uid, cardNumber, cardType, validDate, cvv],
    (error, results) => {
      if (error) {
        return res
          .status(500)
          .send("Error inserting credit card info: " + error.message);
      }
      res.send("Credit card info added successfully.");
    }
  );
});

app.put("/member/order/rating", (req, res) => {
  const {
    orderId,
    rateClean,
    ratePosition,
    rateService,
    rateFacility,
    title,
    content,
  } = req.body;
  console.log("Received rating data:", req.body);
  const sql = `
    UPDATE orderinfo
    SET rateClean = ?, ratePosition = ?, rateService = ?, rateFacility = ?, title = ?, content = ?
    WHERE orderId = ?
  `;

  connection.query(
    sql,
    [
      rateClean,
      ratePosition,
      rateService,
      rateFacility,
      title,
      content,
      orderId,
    ],
    (error, results) => {
      if (error) {
        console.error("An error occurred:", error);
        return;
      }
      console.log("Record updated:", results);
      res.send("Rating updated successfully");
    }
  );
});

function asyncQuery(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
}

app.get("/member/savinglist/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const categorySql = `
        SELECT 
        savingcategory.categoryName,
        savingcategory.categoryId,
        savingcategoryuser.isPrivate,
        Savinglist.postId,
        post.uid,
        userinfo.account,
        post.title
        FROM savingcategoryuser
        JOIN savingcategory ON savingcategoryuser.categoryId = savingcategory.categoryId
        JOIN Savinglist ON savingcategory.categoryId = Savinglist.categoryId AND savingcategoryuser.uid = Savinglist.Uid
        JOIN post ON Savinglist.postId = post.postId
        JOIN userinfo ON post.uid = userinfo.uid
        WHERE savingcategoryuser.uid = ?
        GROUP BY savingcategory.categoryName, savingcategoryuser.isPrivate, Savinglist.postId
        ORDER BY savingcategory.categoryName, Savinglist.saveTime DESC`;

    const categoriesAndPosts = await asyncQuery(categorySql, [userId]);

    const postsWithImages = await Promise.all(
      categoriesAndPosts.map(async (post) => {
        const imagesSql = `SELECT img FROM imgdata WHERE postId = ?`;
        const imagesData = await asyncQuery(imagesSql, [post.postId]);
        // 将图像数据转换为 Base64
        const imagesBase64 = imagesData.map((img) =>
          Buffer.from(img.img, "binary").toString("base64")
        );
        return {
          ...post,
          images: imagesBase64,
        };
      })
    );

    res.json(postsWithImages);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.delete("/member/savinglist/deletePost", function (req, res) {
  const { uid, postid } = req.body;
  if (!uid || !postid) {
    return res.status(400).send("UID and PostID are required");
  }
  const sql = `DELETE FROM savinglist WHERE uid = ? AND postid = ?`;
  connection.query(sql, [uid, postid], (err, result) => {
    if (err) {
      console.error("An error occurred:", err);
      return res.status(500).send("An error occurred while deleting the post.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Post not found.");
    }

    res.send("Post deleted successfully.");
  });
});

app.put("/member/savinglist/togglePrivate", (req, res) => {
  const { uid, categoryId } = req.body;
  if (!uid || !categoryId) {
    return res.status(400).send("UID and CategoryId are required.");
  }

  const sql = `
      UPDATE savingcategoryuser 
      SET isPrivate = NOT isPrivate 
      WHERE uid = ? AND categoryId = ?`;

  connection.query(sql, [uid, categoryId], (error, results) => {
    if (error) {
      return res.status(500).send("An error occurred.");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("No matching records found.");
    }
    res.send("isPrivate status toggled successfully.");
  });
});

app.get("/member/info/basic/:id", function (req, res) {
  connection.query(
    "SELECT * FROM `userinfo` WHERE Uid = ?",
    [req.params.id],
    function (err, result) {
      if (err) {
        console.error("Error executing query: ", err);
        res.status(500).send({ error: "Internal Server Error" });
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/member/post/:id", function (req, res) {
  const sql = `
    SELECT post.*, imgdata.img
    FROM post
    INNER JOIN imgdata ON post.postid = imgdata.postid
    WHERE post.uid = 10
    ORDER BY post.postdate DESC;`;
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) {
      console.error("Error executing query: ", err);
      res.status(500).send({ error: "Internal Server Error" });
    } else {
      //圖檔格式轉換工具函式
      //接收一個陣列其陣列內存放物件,物件內有img屬性可將img內屬性二進制轉換為Base64編碼
      //回傳轉換過物件內img屬性的陣列
      let changeToBase64 = (result) => {
        for (let i = 0; i < result.length; i++) {
          let blobImageData = result[i].img;
          result[i].img = Buffer.from(blobImageData, "binary").toString(
            "base64"
          );
        }
        return result;
      };
      let resultWithBase64 = changeToBase64(result);
      res.send(resultWithBase64);
    }
  });
});
