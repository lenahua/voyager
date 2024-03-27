import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/MyPosts.css";
import { Drawer } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "../css/viewPage.css";
import { Modal } from "react-bootstrap";
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
  useEffect(() => {
    const Uid = localStorage.getItem("Uid") || "10";
    const fetchPosts = async () => {
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

    fetchPosts();
  }, []); // 空依赖数组意味着这个effect只会在组件挂载时运行一次
  const [posts, setPost] = React.useState([]);
  const [isRotated, setIsRotated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleClick = () => {
    setIsDrawerOpen(true);
    setIsRotated((prevIsRotated) => !prevIsRotated);
  };
  const toggleDrawer = (open) => (e) => {
    if (e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const drawerContent = (
    <React.Fragment>
      <div style={{ textAlign: "center" }}>
        <h3>上傳照片</h3>
      </div>
      <div className="modal-body">
        <h4>Upload image:</h4>
        <form action="">
          <input className="form-control" type="file" id="uploadImg" multiple />
        </form>
      </div>
      <div className="modal-header border-top">
        <h3>貼文說明</h3>
      </div>
      <div className="modal-body">
        <form>
          <textarea className="form-control" id="textBox" rows="5"></textarea>
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-outline-success">
          確認上傳貼文
        </button>
      </div>
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
              width: 1000,
              my: "auto",
              mx: "auto",
              position: "fixed",
              top: "50%",
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
  const formatTime = (utcDateString) => {
    const utcDate = new Date(utcDateString);
    return utcDate.toLocaleString();
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
              `http://localhost:8000/viewPage/getModal?postid=${postid}`
            ),
            axios.get(`http://localhost:8000/viewPage/getTag?postid=${postid}`),
            axios.get(
              `http://localhost:8000/viewPage/getComment?postid=${postid}`
            ),
            axios.get(
              `http://localhost:8000/viewPage/getCommentCouner?postid=${postid}`
            ),
          ]);

        setModalInfoAry(postContent.data);
        setPostTagAry(postTag.data);
        setPostCommentAry(postComment.data);
        setCommentCounter(commentCounter.data);
        console.log("API response for modal content:", postContent.data);
        console.log("API response for modal tag:", postTag.data);
        console.log("API response for modal comment:", postComment.data);
        console.log("API response for modal counter:", commentCounter.data);
      } catch (error) {
        console.error("Failed to load modal content:", error);
      }
    };
    loadData();
  }, [postid, isOpen]); // 依賴數組 isOpen 和 postid

  return (
    <Modal show={isOpen} onHide={onClose} size="xl" centered>
      <div className="viewModalDialog">
        <div className="ViewModalContent modal-content d-flex flex-row h-100 bg-dark">
          <div
            id="mybox"
            className="mybox d-flex flex-row flex-wrap w-100 h-100"
          >
            <div className="imgArea col-12 col-sm-6 d-flex align-items-center h-100">
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
                <h3 className="mb-0">
                  {modalInfoAry.length ? modalInfoAry[0].title : ""}
                </h3>
                <div>
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
                </div>
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
                  <div className="postContent">
                    <a href="">
                      <b>useridapple</b>
                    </a>

                    <p>
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
                            <a href="">#{tag.tag}</a>
                          </React.Fragment>
                        );
                      })}
                    </p>
                  </div>

                  <div className="likeBtnSpace"></div>
                </div>

                {postCommentAry.map((comment, index) => {
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
                        <a href="">
                          <b>useridLily</b>
                        </a>
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

                      <div className="likeBtnSpace">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="currentColor"
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
                  <span className="postTotalLike">
                    {modalInfoAry.length ? modalInfoAry[0].likecounter : "0"}
                    個讚
                  </span>
                  <span className="postTotalComment ms-2">
                    {commentCounter.length
                      ? commentCounter[0].comment_counter
                      : "0"}
                    則回覆
                  </span>
                  <button id="viewLikeIcon" class="float-end iconBtn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      class=" bi bi-suit-heart"
                      viewBox="0 0 16 16"
                    >
                      <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
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
                  <div class="textAreaBox me-2">
                    <textarea
                      rows="1"
                      cols="50"
                      class="w-100 border-0"
                      placeholder="我要留言.."
                      style={{ resize: "none" }}
                    ></textarea>
                  </div>
                  <link to="" class="text-primary sendBtn flex-shrink-0">
                    發布
                  </link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default MyPosts;
