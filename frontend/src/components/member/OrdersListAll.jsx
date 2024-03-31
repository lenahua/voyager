import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/order.css";
import "@fontsource/inter";
import { Modal, TextField, Rating, Popover } from "@mui/material";
import { Link } from "react-router-dom";

function OrdersList({ filterOrders, filterOption, hotelId }) {
  console.log("ori filterorder", filterOrders);
  let sortedOrders = [...filterOrders];

  if (filterOption === "future") {
    sortedOrders = sortedOrders
      .filter((order) => {
        let startDate = new Date(order.startDate);
        let today = new Date();
        return startDate > today;
      })
      .sort((a, b) => {
        let distanceA = new Date(a.startDate) - new Date();
        let distanceB = new Date(b.startDate) - new Date();
        return distanceA - distanceB;
      });
  }
  console.log("sorted filterorder", filterOrders);

  return (
    <div className="mt-3 mb-5 ">
      {sortedOrders.map((order) => (
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
  console.log(filterOption);
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
  const DaysLeft = (startDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const timeDiff = start - now;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };
  let timeLeftString = "";
  if (orderStatus === "future") {
    const daysLeft = DaysLeft(startDate);
    if (daysLeft < 30) {
      timeLeftString = (
        <div className="time-left-days">距離入住還有 {daysLeft} 天</div>
      );
    } else {
      const monthsLeft = Math.ceil(daysLeft / 30);
      timeLeftString = (
        <div className="time-left-months">距離入住還有 {monthsLeft} 個月</div>
      );
    }
  }

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
    setAnchor(event.currentTarget);
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
    const now = new Date();
    //轉成台灣時區
    const taiwanTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const ratetime = taiwanTime.toISOString().slice(0, 19).replace("T", " ");
    localStorage.setItem(`ratetime-${orderId}`, ratetime);
    console.log(ratetime);
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
          ratetime,
        }
      );
      console.log("Ratings submitted successfully", response.data);
      setFormOpen(false);
      setIsRated(true);
      handleClose();
    } catch (error) {
      console.error("Error submitting ratings:", error);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA");
  }
  const [isRated, setIsRated] = useState(false);
  //透過localstorage是否有訂單評分改變按鈕狀態
  useEffect(() => {
    const checkIfRated = () => {
      const rated = localStorage.getItem(`rateClean-${orderId}`) !== null;
      setIsRated(rated);
    };
    checkIfRated();
  }, [orderId]);

  return (
    <div className="order-card mb-3 " style={{ padding: "20px" }}>
      <div className="oph">
        <div className="order-photoBox">
          <img className="order-photo" src={image} alt="profile" />
        </div>
        <div className="order-info">
          <Link to={`/hotelInfo/${hotelId}`} style={{ textDecoration: "none" }}>
            <div className="hotelName" style={{ fontFamily: "Inter" }}>
              {chineseName}
            </div>
            <div
              className="hotelName-eng"
              style={{ fontFamily: "Inter", fontWeight: "bold" }}
            >
              {englishName}
            </div>
          </Link>
          <div style={{ marginTop: "5px", fontFamily: "Inter" }}>
            {formatDate(startDate)} - {formatDate(endDate)}
          </div>
        </div>
      </div>
      <div className="orderBox">
        <div className="price-and-button">
          <div className="order-price" style={{ fontFamily: "Inter" }}>
            TWD {price}
          </div>

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
                hotelName={hotelName}
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
                      <Modal
                        open={openForm}
                        onClose={() => {
                          handleCloseForm();
                          handleClose();
                        }}
                        hotelName={hotelName}
                      >
                        <div style={style}>
                          <form>
                            <div
                              style={{
                                padding: "30px 15px 10px 15px",
                                width: "680px",
                              }}
                            >
                              <div>
                                <h2
                                  style={{
                                    fontWeight: "bold",
                                    borderLeft: "5px #3c93d6 solid",
                                    paddingLeft: "10px",
                                    color: "#3c93d6",
                                  }}
                                >
                                  {hotelName}
                                </h2>
                                <div
                                  style={{
                                    marginTop: "30px",
                                    marginButtom: "30px",
                                  }}
                                >
                                  <h4 className="rate-title">評分標題</h4>
                                </div>
                                <TextField
                                  style={{ width: "100%", marginTop: "10px" }}
                                  id="outlined-basic"
                                  variant="standard"
                                  value={title}
                                  placeholder="評分標題"
                                  onChange={handleTitleChange}
                                  InputProps={{
                                    style: { fontSize: "18px" },
                                  }}
                                />
                                <div
                                  style={{
                                    marginTop: "30px",
                                    marginButtom: "30px",
                                  }}
                                >
                                  <h4 className="rate-title">評分內文</h4>
                                </div>
                                <TextField
                                  style={{ width: "100%", marginTop: "10px" }}
                                  id="standard-multiline-static"
                                  multiline
                                  rows={5}
                                  placeholder="評分內文"
                                  variant="standard"
                                  value={content}
                                  onChange={handleContentChange}
                                  InputProps={{
                                    style: { fontSize: "18px" },
                                  }}
                                />{" "}
                                <div
                                  style={{
                                    marginTop: "30px",
                                    marginButtom: "30px",
                                  }}
                                >
                                  <div className="row">
                                    <div className="rateForm col-6">
                                      <h4 style={{ fontWeight: "bold" }}>
                                        整潔度
                                      </h4>
                                      <div className="rateAnwser">
                                        <Rating
                                          name="clean"
                                          value={rateClean}
                                          onChange={(event, newValue) =>
                                            handleCleanChange(event, newValue)
                                          }
                                          onChangeActive={(event, newHover) =>
                                            setHover1(newHover)
                                          } //set hover for star rates
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
                                      <h4 style={{ fontWeight: "bold" }}>
                                        服務
                                      </h4>
                                      <div className="rateAnwser">
                                        <Rating
                                          name="service"
                                          value={rateService}
                                          onChange={(event, newValue) =>
                                            handleServiceChange(event, newValue)
                                          }
                                          onChangeActive={(event, newHover) =>
                                            setHover2(newHover)
                                          }
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
                                      <h4 style={{ fontWeight: "bold" }}>
                                        設備
                                      </h4>
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
                                          }
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
                                      <h4 style={{ fontWeight: "bold" }}>
                                        位置
                                      </h4>
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
                                          }
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
                              style={{ fontSize: "20px" }}
                            >
                              取消
                            </button>
                            <div style={{ flexGrow: 1 }}></div>
                            <button
                              className="form-button"
                              type="button"
                              style={{ float: "right", fontSize: "20px" }}
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
        {orderStatus === "future" && (
          <div>
            <div>{timeLeftString}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersList;
