import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/MyPosts.css";
import { Drawer } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "../../css/viewPage.css";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

function MyPosts({ userId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  //指定postid。相同圖片=>重置postId。不同圖片=>設置selectedPostId
  const handleImageClick = (postid) => {
    if (selectedPostId === postid) {
      setSelectedPostId(null);
      setTimeout(() => setSelectedPostId(postid), 0);
    } else {
      setSelectedPostId(postid);
    }
    setIsModalOpen(true);
  };

  const fetchPosts = async () => {
    const Uid = localStorage.getItem("Uid") || "10";
    try {
      const response = await axios.get(
        `http://localhost:8000/member/post/${Uid}`
      );
      console.log("Original data:", response.data);

      // merge new object => if postid 存在
      const mergedPosts = response.data.reduce((accumulator, current) => {
        if (!accumulator[current.postid]) {
          accumulator[current.postid] = { ...current, img: [current.img] };
        } else {
          accumulator[current.postid].img.push(current.img);
        }
        return accumulator;
      }, {});

      // object to array，然後更新posts
      const mergedPostsArray = Object.values(mergedPosts);
      console.log("Merged posts:", mergedPostsArray);
      setPost(mergedPostsArray);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  const [posts, setPost] = React.useState([]);
  const [isRotated, setIsRotated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleClick = () => {
    setIsDrawerOpen(true);
    setIsRotated((prevIsRotated) => !prevIsRotated);
  };
  const toggleDrawer = (open) => (e) => setIsDrawerOpen(open);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const Uid = "10";
    const formData = new FormData();
    if (data.picture.length > 0) {
      formData.append("picture", data.picture[0]);
    }

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("Uid", Uid);

    try {
      const response = await fetch("http://localhost:8000/picture", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      await fetchPosts();
      const res = await response.json();
      alert(JSON.stringify(res));
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred: " + error.message);
    }
  };

  const drawerContent = (
    <React.Fragment>
      <div className="drawertitle">
        <h3
          style={{ fontWeight: "bold", color: "#3c93d6" }}
          className="mb-2 mt-2"
        >
          上傳貼文
        </h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pt-3 pb-3">
          <div className="row">
            <div className="col-6 " style={{ height: "100%" }}>
              <div class="mb-4">
                <label for="exampleFormControlInput1" class="form-label">
                  <h4>貼文標題</h4>
                </label>
                <input
                  {...register("title")}
                  type="text"
                  placeholder="景點標題"
                  class="form-control"
                  id="exampleFormControlInput1"
                />
              </div>
              <div class="mb-2">
                {" "}
                <h4>景點位置</h4>
                <select
                  class="form-select form-select-md"
                  aria-label=".form-select-lg example"
                  {...register("location")}
                >
                  <option selected>台北</option>
                  <option value="台北市">台北</option>
                  <option value="新北市">新北</option>
                  <option value="新竹市">新竹</option>
                  <option value="台中市">台中</option>
                  <option value="台南市">台南</option>
                  <option value="高雄市">高雄</option>
                  <option value="花蓮市">花蓮</option>
                  <option value="台東市">台東</option>
                </select>
              </div>
            </div>

            <div className="col-6 d-flex flex-column justify-content-end mb-3">
              <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">
                  <h4>貼文說明</h4>
                </label>
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="5"
                  {...register("description")}
                  type="text"
                  placeholder="為你的貼文增加說明吧！"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="row">
            {" "}
            <div className=" col-9">
              <input
                {...register("picture")}
                type="file"
                name="picture"
                class="form-control"
                style={{ height: "100%" }}
              />
            </div>
            <button type="submit" className="upload-btn col-3 ">
              確認
            </button>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
  return (
    <div style={{ width: "1140px" }}>
      <div className="favorite-box">
        <div className="post-outer-box">
          {posts.map((item, index) => (
            <img
              className="post-img"
              key={index}
              src={`data:image/jpeg;base64,${item.img[0]}`}
              alt={item.title}
              onClick={() => handleImageClick(item.postid)}
            />
          ))}
        </div>
        {Number(userId) === 10 && (
          <div
            style={{
              position: "absolute",
              right: "25px",
              bottom: "20px",
            }}
          >
            <i
              className="bi bi-plus-circle-fill"
              onClick={handleClick}
              style={{
                fontSize: "45px",
                color: "#3c93d6",
                backgroundColor: "#fff",
                borderRadius: "50%",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transform: isRotated ? "rotate(90deg)" : "none",
                transition: "transform 0.2s",
              }}
            ></i>
          </div>
        )}
        <Drawer
          anchor="bottom"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            "& .MuiDrawer-paper": {
              borderRadius: "16px 16px 0 0",
              maxHeight: "100%",
              width: 800,
              my: "auto",
              mx: "auto",
              position: "fixed",
              top: "45%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            },
          }}
          ModalProps={{
            closeAfterTransition: true,
            BackdropProps: {
              timeout: 500,
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <div>
          {isModalOpen && (
            <Modalll
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              postid={selectedPostId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Modalll({ isOpen, onClose, postid }) {
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const formatTimeForPost = (utcDateString) => {
    const utcDate = new Date(utcDateString);
    const year = utcDate.getFullYear();
    const month = utcDate.getMonth() + 1;
    const day = utcDate.getDate();
    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  };
  const formatTime = (utcDateString) => {
    let localDateString = formatTimeForPost(utcDateString);
    const utcDate = new Date(utcDateString);
    let hours = utcDate.getHours();
    var minutes = utcDate.getMinutes();
    var seconds = utcDate.getSeconds();

    if (hours < 12) {
      localDateString += ` 
        上午${hours < 10 ? "0" + hours : hours}:${
        minutes < 10 ? "0" + minutes : minutes
      }:${seconds < 10 ? "0" + seconds : seconds}`;
    } else {
      hours -= 12;
      localDateString += ` 
        下午${hours < 10 ? "0" + hours : hours}:${
        minutes < 10 ? "0" + minutes : minutes
      }:${seconds < 10 ? "0" + seconds : seconds}`;
    }
    return localDateString;
  };

  const [modalInfoAry, setModalInfoAry] = useState([]);
  const [postTagAry, setPostTagAry] = useState([]);
  const [postCommentAry, setPostCommentAry] = useState([]);
  const [commentCounter, setCommentCounter] = useState([]);
  let postContent = modalInfoAry.length ? modalInfoAry[0].postcontent : "";
  let formatContentAry = postContent.split("\r\n");

  useEffect(() => {
    // loaddata
    const loadData = async () => {
      if (!postid) return;
      console.log(`Loading data for postid: ${postid}`);
      try {
        const [postContent, postTag, postComment, commentCounter] =
          await Promise.all([
            axios.get(
              `http://localhost:8000/viewPage/getModallily?postid=${postid}`
            ),
            axios.get(`http://localhost:8000/viewPage/getTag?postid=${postid}`),
            axios.get(
              `http://localhost:8000/viewPage/getCommentlily?postid=${postid}`
            ),
            axios.get(
              `http://localhost:8000/viewPage/getCommentCouner?postid=${postid}`
            ),
          ]);

        setModalInfoAry(postContent.data);
        setPostTagAry(postTag.data);
        setPostCommentAry(postComment.data);
        setCommentCounter(commentCounter.data);
        console.log("API response for modalInfoAry:", postContent.data);
        console.log("API response for postTagAry:", postTag.data);
        console.log("API response for postCommentAry:", postComment.data);
        console.log("API response for commentCounter:", commentCounter.data);
      } catch (error) {
        console.error("Failed to load modal content:", error);
      }
    };
    loadData();
  }, [postid, isOpen]); // 依賴數組 isOpen 和 postid
  const [likedComments, setLikedComments] = useState([]);
  const toggleLike = (index) => {
    setLikedComments((prevLikedComments) => {
      const updatedLikes = [...prevLikedComments];
      updatedLikes[index] = !updatedLikes[index];
      return updatedLikes;
    });
  };

  const [newComment, setNewComment] = useState("");
  const postComment = async () => {
    console.log(postid);
    const Uid = localStorage.getItem("Uid") || "10";
    try {
      const response = await axios.post(
        `http://localhost:8000/viewPage/postComment`,
        {
          postid: postid,
          uid: Uid,
          commentText: newComment,
        }
      );

      if (response.data) {
        console.log("Comment posted successfully");
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/viewPage/getCommentlily?postid=${postid}`
      );
      if (response.data) {
        setPostCommentAry(response.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  useEffect(() => {
    if (isOpen && postid) {
      fetchComments();
    }
  }, [isOpen, postid]);
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      size="xl"
      centered
      className="viewModal"
    >
      <div id="mybox" className="mybox d-flex flex-row flex-wrap w-100 h-100">
        <div className="imgArea col-12 col-sm-6 d-flex align-items-center h-100 flex-shrink-1">
          {modalInfoAry.length === 1 ? (
            <img
              src={`data:image/jpeg;base64,${modalInfoAry[0].img}`}
              alt="img"
              style={{ width: "100%", height: "auto" }}
            />
          ) : (
            <Slider {...settings}>
              {modalInfoAry.map((image, index) => (
                <div key={index}>
                  <img
                    src={`data:image/jpeg;base64,${image.img}`}
                    alt="img"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              ))}
            </Slider>
          )}
        </div>

        <div className="postArea col-12 col-sm-6 d-flex flex-column px-2 h-100">
          <div className="postHead d-flex align-items-center justify-content-between border-bottom border-secondary py-2">
            <h3 className="mb-0 d-inline-block">
              {modalInfoAry.length ? modalInfoAry[0].title : ""}
            </h3>
            <p className="mb-0">
              {modalInfoAry.length
                ? formatTimeForPost(modalInfoAry[0].postdate)
                : ""}
            </p>
          </div>

          <div className="postBody h-100 px-2">
            <div className="userPost py-2 d-flex">
              <div className="postIconSpace d-flex justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30px"
                  height="30px"
                  fill="currentColor"
                  className="d-block bi bi-person-circle myicon"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />
                </svg>
              </div>
              {/* postContent */}
              <div className="postContent mt-1">
                <Link to="">
                  <b>{modalInfoAry.length ? modalInfoAry[0].account : ""}</b>
                </Link>

                <p className="postContent mt-2">
                  {formatContentAry.map((sentence, index) => {
                    return (
                      <React.Fragment key={index}>
                        {sentence}
                        <br />
                      </React.Fragment>
                    );
                  })}
                </p>
                <p className="postTag">
                  {postTagAry.map((tag, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Link to="">#{tag.tag}</Link>
                      </React.Fragment>
                    );
                  })}
                </p>
              </div>

              <div className="likeBtnSpace"></div>
            </div>

            {postCommentAry.map((comment, index) => {
              const isLiked = likedComments[index] || false;
              return (
                <div key={index} className="postComment py-2 d-flex">
                  <div className="postIconSpace d-flex justify-content-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30px"
                      height="30px"
                      fill="currentColor"
                      className="d-block bi bi-person-circle myicon"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path
                        fillRule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                      />
                    </svg>
                  </div>

                  <div className="postContent">
                    <Link to="">
                      <b>{comment.account}</b>
                    </Link>
                    <p>{comment.comment}</p>
                    <p>
                      <span className="commentTime me-2">
                        {formatTime(comment.commenttime)}
                      </span>
                      <span className="likeCounter ms-1">
                        {comment.likecounter}個讚
                      </span>
                      <span className="commentCounter ms-1">回覆</span>
                    </p>
                  </div>

                  <div
                    className="likeBtnSpaceee"
                    onClick={() => toggleLike(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill={isLiked ? "red" : "currentColor"}
                      className="bi bi-suit-heart"
                      viewBox="0 0 16 16"
                    >
                      <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="postFoot">
            <div className="postInfo py-1 border-top border-1 border-secondary">
              <button
                id="viewLikeIcon"
                className="iconBtn"
                onClick={() => {
                  this.clickLike(this.props.info[0].postid);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className=" bi bi-suit-heart"
                  viewBox="0 0 16 16"
                >
                  <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
                </svg>
              </button>
              <span className="postTotalLike ms-2">
                {modalInfoAry.length ? modalInfoAry[0].likecounter : "0"}
                個讚
              </span>
              <span className="postTotalComment ms-2">
                {commentCounter.length
                  ? commentCounter[0].comment_counter
                  : "0"}
                則回覆
              </span>
              <button id="viewSavingIcon" className="border-0 float-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="currentColor"
                  className="bi bi-bookmark"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                </svg>
              </button>
            </div>
            <div class="writeCommentBox py-2 border-top border-1 border-secondary d-flex align-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="currentColor"
                class="bi bi-chat d-block flex-shrink-0"
                viewBox="0 0 16 16"
              >
                <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
              </svg>
              <div class="textAreaBox ms-2 d-flex align-items-center">
                <textarea
                  rows="1"
                  cols="50"
                  class="w-100 border-0"
                  placeholder="我要留言.."
                  style={{ resize: "none" }}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
              </div>
              <div
                class="text-primary sendBtn flex-shrink-0"
                onClick={postComment}
                style={{ cursor: "pointer" }}
              >
                發布
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default MyPosts;
