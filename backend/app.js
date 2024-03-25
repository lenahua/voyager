var express = require("express");
var cors = require("cors");
var app = express();
app.listen(8000);
app.use( express.json() );
app.use( express.urlencoded( {extended: true}) );
app.use(cors());


var mysql = require("mysql");
var connection = mysql.createConnection({
    host:"127.0.0.1",
    port:3306,    
    user:"root",
    password:"",
    database:"voyager_dev",
    charset: "utf8mb4"
});

connection.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Connected");
    }
});
//圖檔格式轉換工具函式
//接收[{img:...},{img:...}],可將img內屬性二進制轉換為Base64編碼
//回傳轉換過物件內img屬性的陣列
let changeToBase64 = (result)=>{
    for(let i=0;i<result.length;i++){
        let blobImageData =result[i].img;
        result[i].img = Buffer.from(blobImageData, 'binary').toString('base64');
    }
    return result ;
}

//找到特定貼文postid的所有照+資訊,回傳的是陣列
app.get("/viewPage/getModal", function (req, res) {
    connection.query(
        `SELECT post.postid,imgdata.img,post.title,
        post.postdate,post.postcontent,userinfo.account
        FROM imgdata,post,userinfo
        WHERE imgdata.postid  = post.postid 
        AND post.uid = userinfo.uid
        AND post.postid = ?`,[req.query.postid],
        function (err, result) {
            let newResult = changeToBase64(result);
            console.log(result);
            res.send(newResult);  
        }
    )
})

//取得特定貼文postid的所有標籤
app.get("/viewPage/getTag",function(req,res){
    connection.query(`
    SELECT tag 
    FROM posttag,post
    WHERE posttag.postid = post.postid
    AND posttag.postid = ?`,[req.query.postid],
    function(err,result){
        res.send(result);
    })
})

//取得所有貼文相關資訊
app.get("/viewPage/allPost",function(req,res){
    connection.query(
        `SELECT * FROM post WHERE 1`,[],
        function(err,result){
            res.send(result);
        }
    )
});

//取得所有不同貼文的第一張照片
app.get("/viewPage/imgList",function(req,res){
    connection.query(
        `SELECT MIN(id), postid, img 
        FROM imgdata 
        GROUP BY postid 
        ORDER BY postid DESC `,[],
        function(err,result){
            result = changeToBase64(result);
            res.send(result);
        }
    );
});
//取得指定縣市的所有不同貼文的第一張圖片及該貼文的相關資訊
app.get("/viewPage/locationFilter",function(req,res){
    connection.query(`
        SELECT *,min(imgdata.id) as firstPicId 
        FROM post,imgdata 
        WHERE location = ? AND
        post.postid = imgdata.postid
        GROUP BY imgdata.postid
        ORDER BY imgdata.postid DESC`
    ,[req.query.lname], 
    function(err,result){      
        result = changeToBase64(result);
        res.send(result);
    });
});

//發布貼文留言=> 目前寫死留言都會是UID 3在留言 =>等登入功能
app.post(`/viewPage/postComment`,function(req,res){
    connection.query(`
        INSERT INTO postcomment( postid, Uid,comment, likecounter, commenttime) 
        VALUES (?,3,?,0,NOW());`,[req.body.postid,req.body.commentText],
    function(err,result){
        console.log(result);
        res.send(result);
    })
})
//取得貼文所有留言內容
app.get(`/viewPage/getComment`,function(req,res){
    connection.query(`
        SELECT * 
        FROM post,postcomment
        WHERE post.postid = postcomment.postid AND 
        post.postid = ?
        ORDER BY commenttime DESC`,[req.query.postid],
    function(err,result){
        console.log(result);
        res.send(result);
    })
})
//取得貼文留言總數
app.get(`/viewPage/getCommentCouner`,function(req,res){
    connection.query(`
        SELECT COUNT(*) AS comment_counter
        FROM post,postcomment
        WHERE post.postid = postcomment.postid
        AND post.postid = ?`,[req.query.postid],
    function(err,result){
        res.send(result);
    })
});

//取得特定貼文的留言的使用者帳號(account)
app.get(`/viewPage/getCommentAccount`,function(req,res){
    connection.query(`
        SELECT account 
        FROM post,postcomment,userinfo
        WHERE post.postid = postcomment.postid AND 
        postcomment.Uid = userinfo.Uid AND
        post.postid = ?
        ORDER BY commenttime DESC`,[req.query.postid],
    function(err,result){
        res.send(result);
    });
});
//取得貼文按讚狀態=>已點or未點
app.get(`/viewPage/getLikeState`,function(req,res){
    connection.query(`
        SELECT count(*) as state
        FROM postliketable
        WHERE uid = ? AND
        postid = ?`,[req.query.uid,req.query.postid],
    function(err,result){
        res.send(result);
    });
});
//取消特定貼文的點讚
app.delete(`/viewPage/cancelLike`,function(req,res){
    connection.query(`
        DELETE FROM postliketable WHERE uid = ?`,[req.query.uid],
    function(err,result){
        res.send("cancel sucess");
    })
})
//對特定貼文點讚
app.post(`/viewPage/addLike`,function(req,res){
    connection.query(`
        INSERT INTO postliketable(postid,uid) VALUES (?,?)`,[req.query.postid,req.query.uid],
    function(err,result){
        res.send("addLike sucess");
    })
})
//取得特定貼文讚數
app.get(`/viewPage/getLikeCounter`,function(req,res){
    connection.query(`
        SELECT COUNT(*) as likeCounter FROM postliketable WHERE postid = ?`,[req.query.postid],
    function(err,result){
        res.send(result);
    })
})

//取得特定貼文是否被收藏
app.get(`/viewPage/getSavingState`,function(req,res){
    connection.query(`
        SELECT COUNT(*) as state
        FROM savinglist 
        WHERE postid = ? AND
        uid = ?`,[req.query.postid,req.query.uid],
    function(err,result){
        res.send(result);
    })
})
//對特定貼文取消收藏
app.delete(`/viewPage/deleteSavingState`,function(req,res){
    connection.query(`
        DELETE FROM savinglist 
        WHERE postid = ? AND uid = ?`,[req.query.postid,req.query.uid],
    function(err,result){
        res.send("cancle saving");
    })
}); 

//對特定貼文增加收藏
app.post(`/viewPage/addSavingState`,function(req,res){
    connection.query(`
        INSERT INTO savinglist( Uid, postId, categoryId, saveTime) 
        VALUES (?,?,?,NOW())`,[req.query.uid,req.query.postid,8],
    function(err,result){
        res.send("addLike sucess");
    })
})
//-------------------------------------------------------------------

