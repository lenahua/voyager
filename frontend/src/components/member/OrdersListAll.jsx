import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/order.css";
import "@fontsource/inter";
import { Modal, TextField, Rating, Popover } from "@mui/material";
import { Link } from "react-router-dom";

/* {
  "orderId": 5,
  "Uid": 10,
  "name": "台中赫絲珀HSR高鐵行旅 Hesper Hotel",
  "startDate": "2024-05-10T16:00:00.000Z",
  "endDate": "2024-05-27T16:00:00.000Z",
  "price": 1020,
  "hotelId": 2,
  "photo_urls": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/250509585.jpg?k=045b1c581ca6faa9c656dae02f404decd7fec21845fcdbe7e8cd21f3e8d74221&o=&hp=1, https://cf.bstatic.com/xdata/images/hotel/max1024x768/179241673.jpg?k=bbd696940a0974e0c5bb9a65011a400b018423ee333c1f6081a44130dd73de34&o=&hp=1, https://cf.bstatic.com/xdata/images/hotel/max1024x768/182105364.jpg?k=9b0ba142d9a5a8fd14dcc1fb3bf0704c99c0cabfc1a4b1356f01bd1903a039c3&o=&hp=1, https://cf.bstatic.com/xdata/images/hotel/max1024x768/256677827.jpg?k=3eb3c25bee1f776eda991c404d309d5b739c1fe59ca86a07a00406c40b420ac3&o=&hp=1, https://cf.bstatic.com/xdata/images/hotel/max1024x768/182105495.jpg?k=0d69f4a7973e1d9db55066b57077a7e887f2a4b1ab9652a78d7ee91ce26f6d47&o=&hp=1, https://cf.bstatic.com/xdata/images/hotel/max1024x768/182105411.jpg?k=303a5d976bbd7821f659613d4bce0fbb5d0da00c09c5479dd61ebb33677ad54d&o=&hp=1"
}, */

function OrdersList({ filterOrders, filterOption, hotelId }) {
  console.log(filterOrders);
  return (
    <div className="mt-3 mb-5 ">
      {filterOrders.map((order) => (
        <Order
          key={order.orderId}
          hotelName={order.name}
          startDate={order.startDate}
          endDate={order.endDate}
          image={order.photo_url}
          price={order.price}
          filterOption={filterOption}
          hotelId={order.hotelId}
          orderId={order.orderId}
        />
      ))}
    </div>
  );
}

function Order({
  hotelName,
  hotelId,
  startDate,
  endDate,
  price,
  filterOption,
  orderId,
  image,
}) {
  const today = new Date();
  const end = new Date(endDate);
  const start = new Date(startDate);
  let orderStatus = "current"; // 預設為當前訂單
  if (end < today) {
    orderStatus = "past"; // 過去的訂單
  } else if (start > today) {
    orderStatus = "future"; // 未來的訂單
  }

  //hotelname
  const separateName = (name) => {
    const chinese = name.match(/[\u4e00-\u9fa5]+/g)?.join("") || "";
    const english = name.match(/[a-zA-Z ]+/g)?.join("") || "";
    return { chinese, english };
  };
  const [chineseName, setChineseName] = useState("");
  const [englishName, setEnglishName] = useState("");
  useEffect(() => {
    const names = separateName(hotelName);
    setChineseName(names.chinese);
    setEnglishName(names.english);
  }, [hotelName]);

  //rating and title
  const labels = {
    1: "十分不滿意",
    2: "不滿意",
    3: "普通",
    4: "滿意",
    5: "十分滿意",
    0: "",
  };

  const [hover1, setHover1] = React.useState(-1);
  const [hover2, setHover2] = React.useState(-1);
  const [hover3, setHover3] = React.useState(-1);
  const [hover4, setHover4] = React.useState(-1);

  const [rateClean, setrateClean] = useState(() => {
    const savedRateClean = localStorage.getItem(`rateClean-${orderId}`);
    return savedRateClean ? Number(savedRateClean) : 0;
  });
  const handleCleanChange = (event, newValue) => {
    setrateClean(newValue);
    localStorage.setItem(`rateClean-${orderId}`, newValue);
  };

  const [ratePosition, setratePosition] = useState(() => {
    const savedRatePosition = localStorage.getItem(`ratePosition-${orderId}`);
    return savedRatePosition ? Number(savedRatePosition) : 0;
  });
  const handlePositionChange = (event, newValue) => {
    setratePosition(newValue);
    localStorage.setItem(`ratePosition-${orderId}`, newValue);
  };

  const [rateService, setrateService] = useState(() => {
    const savedRateService = localStorage.getItem(`rateService-${orderId}`);
    return savedRateService ? Number(savedRateService) : 0;
  });
  const handleServiceChange = (event, newValue) => {
    setrateService(newValue);
    localStorage.setItem(`rateService-${orderId}`, newValue);
  };

  const [rateFacility, setrarateFacility] = useState(() => {
    const savedRateFacility = localStorage.getItem(`rateFacility-${orderId}`);
    return savedRateFacility ? Number(savedRateFacility) : 0;
  });
  const handleFacilityChange = (event, newValue) => {
    setrarateFacility(newValue);
    localStorage.setItem(`rateFacility-${orderId}`, newValue);
  };

  const [title, setTitle] = useState(
    localStorage.getItem(`title-${orderId}`) || ""
  );
  const [content, setContent] = useState(
    localStorage.getItem(`content-${orderId}` || "")
  );
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    localStorage.setItem(`title-${orderId}`, newTitle);
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    localStorage.setItem(`content-${orderId}`, newContent);
  };

  useEffect(() => {
    const getAndSetFromLocalStorage = (key, setState) => {
      const savedValue = localStorage.getItem(key);
      if (savedValue !== null) {
        setState(Number(savedValue) || savedValue);
      }
    };

    getAndSetFromLocalStorage(`rateClean-${orderId}`, setrateClean);
    getAndSetFromLocalStorage(`ratePosition-${orderId}`, setratePosition);
    getAndSetFromLocalStorage(`rateService-${orderId}`, setrateService);
    getAndSetFromLocalStorage(`rateFacility-${orderId}`, setrarateFacility);
    getAndSetFromLocalStorage(`title-${orderId}`, setTitle);
    getAndSetFromLocalStorage(`content-${orderId}`, setContent);
  }, [orderId]);

  //popover
  const [anchor, setAnchor] = useState(null);
  const handleOpen = (event) => {
    setAnchor(event.currentTarget); // 这里设置anchor状态
  };
  const handleClose = () => {
    setAnchor(null);
  };
  const open = Boolean(anchor);
  const popId = open ? "simple-popover" : undefined;

  const [openForm, setFormOpen] = React.useState(false);
  const handleOpenForm = () => {
    setFormOpen(true);
    console.log("Opening form");
    console.log(hotelId);
  };
  const handleCloseForm = () => {
    setFormOpen(false);
    console.log("Closing form");
  };

  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    border: "2px solid #3c93d6",
    boxShadow: "24",
    zIndex: 1000,
    borderRadius: "20px",
    padding: "30px 60px",
  };

  const submitRatings = async () => {
    const rateClean = Number(localStorage.getItem(`rateClean-${orderId}`)) || 0;
    const ratePosition =
      Number(localStorage.getItem(`ratePosition-${orderId}`)) || 0;
    const rateService =
      Number(localStorage.getItem(`rateService-${orderId}`)) || 0;
    const rateFacility =
      Number(localStorage.getItem(`rateFacility-${orderId}`)) || 0;
    const title = localStorage.getItem(`title-${orderId}`) || "";
    const content = localStorage.getItem(`content-${orderId}`) || "";

    try {
      console.log("Sending rating submission request");
      const response = await axios.put(
        "http://localhost:8000/member/order/rating",
        {
          orderId,
          rateClean,
          ratePosition,
          rateService,
          rateFacility,
          title,
          content,
        }
      );
      console.log("Ratings submitted successfully", response.data);
      setFormOpen(false);
      setIsRated(true);
    } catch (error) {
      console.error("Error submitting ratings:", error);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA"); // 加拿大英語格式會返回 YYYY-MM-DD 格式
  }
  const [isRated, setIsRated] = useState(false);
  //透過localstorage的
  useEffect(() => {
    // 创建一个检查函数来看看localStorage中是否存有该订单的评分信息
    const checkIfRated = () => {
      // 例如，我们检查一下"rateClean"是否已经为该orderId评分
      const rated = localStorage.getItem(`rateClean-${orderId}`) !== null;
      // 设置isRated状态
      setIsRated(rated);
    };

    // 调用checkIfRated函数来更新状态
    checkIfRated();
  }, [orderId]); // 依赖数组里的orderId确保当orderId变化时，重新检查

  return (
    <div className="order-card mb-3 " style={{ padding: "20px" }}>
      <div className="oph">
        <div className="order-photoBox">
          <img className="order-photo" src={image} alt="profile" />
        </div>
        <div className="order-info">
          <Link to={`/hotelInfo/${hotelId}`}>
            <div className="hotelName">{chineseName}</div>
            <div className="hotelName-eng">{englishName}</div>
          </Link>
          <div>
            {formatDate(startDate)} - {formatDate(endDate)}
          </div>
        </div>
      </div>
      <div className="orderBox">
        <div className="price-and-button">
          <div className="order-price">TWD {price}</div>
          <div className="orderstatus">
            <div>
              {(orderStatus === "past" || orderStatus === "future") && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  fill="currentColor"
                  className="bi bi-three-dots-vertical svg-btn"
                  viewBox="0 0 16 16"
                  onClick={handleOpen}
                >
                  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                </svg>
              )}
              <Popover
                id={popId}
                open={open && filterOption !== "all"}
                anchorEl={anchor}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                sx={{
                  transform: "translate(-30px, 10px)",
                }}
              >
                <div className="list-group">
                  {orderStatus === "current" && (
                    <>
                      <button className="list-group-item list-group-item-action">
                        <span>刪除訂單</span>
                      </button>
                      <button className="list-group-item list-group-item-action">
                        <span>取消訂單</span>
                      </button>
                      <button
                        onClick={handleOpenForm}
                        className="list-group-item list-group-item-action"
                      >
                        <span>評分訂單</span>
                      </button>
                    </>
                  )}
                  {orderStatus === "past" && (
                    <React.Fragment>
                      <button className="list-group-item list-group-item-action">
                        <span onClick={handleOpenForm}>評分訂單</span>
                      </button>
                      <Modal open={openForm} onClose={handleCloseForm}>
                        <div style={style}>
                          <form>
                            <div style={{ padding: "30px 15px" }}>
                              <div>
                                <h4
                                  style={{
                                    marginTop: "30px",
                                    marginButtom: "30px",
                                  }}
                                >
                                  評分標題
                                </h4>
                                <TextField
                                  style={{ width: "100%", marginTop: "5px" }}
                                  id="outlined-basic"
                                  variant="standard"
                                  label="評分標題"
                                  value={title}
                                  onChange={handleTitleChange}
                                />
                                <h4
                                  style={{
                                    marginTop: "30px",
                                    marginButtom: "30px",
                                  }}
                                >
                                  評分內文
                                </h4>
                                <TextField
                                  style={{ width: "100%", marginTop: "5px" }}
                                  id="standard-multiline-static"
                                  multiline
                                  rows={4}
                                  variant="standard"
                                  label="評分內容"
                                  value={content}
                                  onChange={handleContentChange}
                                />{" "}
                                <div
                                  style={{
                                    marginTop: "30px",
                                    marginButtom: "30px",
                                  }}
                                >
                                  <div className="row">
                                    <div className="rateForm col-6">
                                      <h4>整潔度</h4>
                                      <div className="rateAnwser">
                                        <Rating
                                          name="clean"
                                          value={rateClean}
                                          onChange={(event, newValue) =>
                                            handleCleanChange(event, newValue)
                                          }
                                          onChangeActive={(event, newHover) =>
                                            setHover1(newHover)
                                          } // 使用setHover1来更新悬停状态
                                          className="startIcon"
                                        />
                                        <div style={{ fontSize: "20px" }}>
                                          {
                                            labels[
                                              hover1 !== -1 ? hover1 : rateClean
                                            ]
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    <div className="rateForm col-6">
                                      <h4>服務</h4>
                                      <div className="rateAnwser">
                                        <Rating
                                          name="service"
                                          value={rateService}
                                          onChange={(event, newValue) =>
                                            handleServiceChange(event, newValue)
                                          }
                                          onChangeActive={(event, newHover) =>
                                            setHover2(newHover)
                                          } // 使用setHover1来更新悬停状态
                                          className="startIcon"
                                        />
                                        <div style={{ fontSize: "20px" }}>
                                          {
                                            labels[
                                              hover2 !== -1
                                                ? hover2
                                                : rateService
                                            ]
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    <div className="rateForm col-6">
                                      <h4>設備</h4>
                                      <div className="rateAnwser">
                                        <Rating
                                          name="facility"
                                          value={rateFacility}
                                          onChange={(event, newValue) =>
                                            handleFacilityChange(
                                              event,
                                              newValue
                                            )
                                          }
                                          onChangeActive={(event, newHover) =>
                                            setHover3(newHover)
                                          } // 使用setHover1来更新悬停状态
                                          className="startIcon"
                                        />
                                        <div style={{ fontSize: "20px" }}>
                                          {
                                            labels[
                                              hover3 !== -1
                                                ? hover3
                                                : rateFacility
                                            ]
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    <div className="rateForm col-6">
                                      <h4>位置</h4>
                                      <div className="rateAnwser">
                                        <Rating
                                          name="position"
                                          value={ratePosition}
                                          onChange={(event, newValue) =>
                                            handlePositionChange(
                                              event,
                                              newValue
                                            )
                                          }
                                          onChangeActive={(event, newHover) =>
                                            setHover4(newHover)
                                          } // 使用setHover1来更新悬停状态
                                          className="startIcon"
                                        />
                                        <div style={{ fontSize: "20px" }}>
                                          {
                                            labels[
                                              hover4 !== -1
                                                ? hover4
                                                : ratePosition
                                            ]
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                          <div className="button-container">
                            <button
                              type="button"
                              onClick={handleCloseForm}
                              className="form-button form-button-cancel"
                            >
                              取消
                            </button>
                            <div style={{ flexGrow: 1 }}></div>
                            <button
                              className="form-button"
                              type="button" // 注意这里改为 type="button"，防止触发表单提交
                              style={{ float: "right" }}
                              onClick={submitRatings}
                            >
                              確認
                            </button>
                            <div style={{ clear: "both" }}></div>{" "}
                            {/* Clearfix */}
                          </div>
                        </div>
                      </Modal>
                    </React.Fragment>
                  )}
                  {orderStatus === "future" && (
                    <button className="list-group-item list-group-item-action">
                      <span>取消訂單</span>
                    </button>
                  )}
                </div>
              </Popover>
            </div>
          </div>
        </div>
        {orderStatus === "past" && (
          <div>
            {isRated ? (
              <div className="form-button-rated">已評分</div>
            ) : (
              <div className="form-button-not-rated">未評分</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersList;
