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
    methods: ["GET", "POST", "PUT", "DELETE"],
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

// VALUES (?,?,?,NOW())`,[req.query.uid,req.query.postid,8],
// function(err,result){
//     res.send("addLike sucess");
// })
// })

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
app.get("/viewPage/getModallily", function (req, res) {
  connection.query(
    `SELECT 
    post.postid,
    imgdata.img,
    post.title,
    post.postdate,
    post.postcontent,
    post.likecounter, 
    userinfo.account
FROM 
    imgdata
INNER JOIN post ON imgdata.postid = post.postid
INNER JOIN userinfo ON post.uid = userinfo.uid
WHERE 
    post.postid = ?;
`,
    [req.query.postid],
    function (err, result) {
      let newResult = changeToBase64(result);
      console.log(result);
      res.send(newResult);
    }
  );
});

app.get(`/viewPage/getCommentlily`, function (req, res) {
  connection.query(
    `SELECT 
    postcomment.comment, 
    postcomment.likecounter, 
    postcomment.commenttime, 
    postcomment.uid, 
    userinfo.account
FROM 
    postcomment
INNER JOIN userinfo ON postcomment.uid = userinfo.uid
WHERE 
    postcomment.postid = ?
ORDER BY 
    postcomment.commenttime DESC;
;`,
    [req.query.postid],
    function (err, result) {
      res.send(result);
    }
  );
});

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

//-------------------------------------------------------------------
//結帳頁面
//取得會員的個人資料
app.get("/checkout/user/:id", function (req, res) {
  connection.query(
    "select * from userinfo where Uid = ? ",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});
//取得該會員的信用卡資訊
app.get("/checkout/creditCard/:id", function (req, res) {
  connection.query(
    "select * from creditcard where Uid = ? ",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});
//取得住宿資訊
app.get("/checkout/hotel/:id", function (req, res) {
  connection.query(
    "select * from hotel where hotel_id = ?",
    [req.params.id],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});
//取得該住宿房型
app.get("/checkout/hotel/:hotelId/:roomId", function (req, res) {
  connection.query(
    "select * from hotel_rooms where hotel_id = ? and room_id = ?",
    [req.params.hotelId, req.params.roomId],
    function (err, rows) {
      res.send(JSON.stringify(rows));
    }
  );
});
//點擊完成訂單傳送訂單資訊到訂單記錄
app.post("/checkout/hotel/order", function (req, res) {
  connection.query(
    "insert into `orderinfo` ( Uid, hotelId, startDate, endDate) values (?, ?, ?, ?)",
    [req.body.Uid, req.body.hotelId, req.body.startDate, req.body.endDate],
    function (err, rows) {
      res.send(JSON.stringify(req.body));
    }
  );
});



// ------------------------------------------------------------------------------

// 飯店詳細
app.get("/hotelInfo/:id", function (req, res) {
  const hotelId = req.params.id;

  // 定義各個資料庫查詢的函式
  const getHotelData = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "select * from hotel where hotel_id = ?",
        [hotelId],
        function (err, hotelRows) {
          if (err) reject("Error fetching hotel data");
          resolve(hotelRows[0]);
        }
      );
    });
  };

  const getHotelPhotos = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "select * from hotel_photos where hotel_id = ?",
        [hotelId],
        function (err, photoRows) {
          if (err) reject("Error fetching hotel photos");
          resolve(photoRows);
        }
      );
    });
  };

  const getHotelRooms = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "select * from hotel_rooms where hotel_id = ?",
        [hotelId],
        function (err, roomRows) {
          if (err) reject("Error fetching hotel rooms");
          resolve(roomRows);
        }
      );
    });
  };

  const getHotelRoomTypes = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "select * from hotel_room_type where hotel_id = ?",
        [hotelId],
        function (err, roomPicRows) {
          if (err) reject("Error fetching hotel room types");
          resolve(roomPicRows);
        }
      );
    });
  };

  const getUserReviews = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT orderinfo.*, userinfo.name FROM orderinfo JOIN userinfo ON orderinfo.Uid = userinfo.Uid WHERE orderinfo.hotelId = ?",
        [hotelId],
        function (err, reviewRows) {
          if (err) reject("Error fetching user reviews");
          resolve(reviewRows);
        }
      );
    });
  };

  const getViewPage = ()=>{
    return new Promise((resolve, reject)=>{
      connection.query(
        "SELECT DISTINCT post.title, imgdata.img from hotel INNER JOIN post on hotel.city = post.location INNER JOIN imgdata on post.postid = imgdata.postid WHERE hotel.hotel_id = ?",
        [hotelId],
        function(err, viewPicsRows){
          if(err) reject("Error fetching view picture");
          let newViewPics = changeToBase64(viewPicsRows);
          // console.log(newViewPics);
          resolve(newViewPics);
        }
      )
    })
  }

  // 使用 Promise執行所有資料庫查詢
  Promise.all([
    getHotelData(),
    getHotelPhotos(),
    getHotelRooms(),
    getHotelRoomTypes(),
    getUserReviews(),
    getViewPage()
  ])
    .then(([hotelData, photoRows, roomRows, roomPicRows, reviewRows, newViewPics]) => {
      const responseData = {
        hotel: hotelData,
        photos: photoRows,
        room: roomRows,
        roomPic: roomPicRows,
        reviews: reviewRows,
        viewpics: newViewPics
      };
      // console.log(viewPicsRows)
      res.send(responseData);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
// login and registe
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  // console.log("Token received:", token);
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not okay" });
      } else {
        req.account = decoded.account;
        req.uid = decoded.uid;
        next();
      }
    });
  }
};

app.get("/login", verifyUser, (req, res) => {
  return res.json({ Status: "Success", account: req.account, uid: req.uid });
});

app.post('/login', (req, res)=>{
  const account = req.body.account;
  const password = req.body.password
  connection.query("select * from userinfo where account = ? and password = ?",
          [account, password],
          // 先比對帳號是否一樣
          (err, data)=>{
              if(err){
                  return res.json({Error: "Login error in server"});
              }  
              if (data.length > 0){
                  const uid = data[0].Uid;
                  const account = data[0].account;
                  const token = jwt.sign({uid,account}, "jwt-secret-key", {expiresIn: '1d'})
                  res.cookie('token', token)
                  // req.session.user = data;
                  // console.log(req.session.user)
                  return res.json({Status: "Success"})
              }else{
                  return res.json({Error: "密碼錯誤，請重新輸入"})
              }
          }
  )
})

app.get("/logout", (req, res) => {
  const token = req.cookies.token;
  // console.log("Token logout:", token)
  // console.log(req.cookies);
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.post('/register', (req, res)=>{
  connection.query("insert into userinfo(account, password, email) values (?, ?, ?)",
      [req.body.account, req.body.password, req.body.email],
      function(err, data){
          if(err) return res.json("registe failed")
          return res.json({Status: "Success"})
      }
  )
})


//旅館清單
app.get("/", function (req, res) {
  res.send("hello world");
});

app.get("/hotelList/hotels", (req, res) => {
  //第一條路徑
  const queryParam = req.query.query;

  let sqlQuery = `SELECT hotel_table.*, hotel_photos.photo_url,room_type,room_people,bed_count,price
  FROM hotel_table
  JOIN (
  SELECT hotel_id, MIN(photo_id) AS minimum_photo_id
  FROM hotel_photos
  GROUP BY hotel_id
  ) AS first_photo ON hotel_table.hotel_id = first_photo.hotel_id
  JOIN hotel_photos ON first_photo.minimum_photo_id = hotel_photos.photo_id
  JOIN hotel_room ON hotel_table.hotel_id = hotel_room.hotel_id`; // 抓取數據庫資料

  if (queryParam) {
    sqlQuery += ` WHERE hotel_table.name LIKE ? OR hotel_table.address LIKE ?`;

    connection.query(
      sqlQuery,
      [`%${queryParam}%`, `%${queryParam}%`],
      (err, results) => {
        // 處理查詢結果
      }
    );
  } else {
    // 沒填參數,就變回原始查詢
    connection.query(sqlQuery, (err, results) => {
      // 查詢結果
    });
  }

  // 搜尋清單

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("查詢失敗:", err);
      res.status(500).send("服務器錯誤");
      return;
    }
    res.json(results);
  });
});

app.get("/hotelList/roomtype", (req, res) => {
  //房型種類路徑
  const sqlQuery = `SELECT hotel_table.*, hotel_photos.photo_url,room_type,room_people,bed_count,price
  FROM hotel_table
  JOIN (
  SELECT hotel_id, MIN(photo_id) AS minimum_photo_id
  FROM hotel_photos
  GROUP BY hotel_id
  ) AS first_photo ON hotel_table.hotel_id = first_photo.hotel_id
  JOIN hotel_photos ON first_photo.minimum_photo_id = hotel_photos.photo_id
  JOIN hotel_room ON hotel_table.hotel_id = hotel_room.hotel_id`; // 抓取數據庫資料

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("查詢失敗:", err);
      res.status(500).send("服務器錯誤");
      return;
    }
    res.json(results);
  });
});
