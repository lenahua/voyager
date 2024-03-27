import React, { useState } from "react";
//import "../App.css";
import "../css/profile.css";
import bg from "./images/bg.jpg";
import profile from "./images/taylor.jpg";
import ProfileInfo from "./Info";
import Orders from "./Orders";
import MyFavorites from "./MyFavorites";
import MyPosts from "./MyPost";

function Member({ userId }) {
  localStorage.setItem("previouspath", window.location.pathname)
  const isLoggedInUser = userId === 10;
  const [selectedTab, setSelectedTab] = useState("radio-1");

  const handleTabChange = (Tab) => setSelectedTab(Tab);

  /* const renderTabContent = () => {
    switch (selectedTab) {
      case "radio-1":
        return <ProfileInfo />;
      case "radio-2":
        return <Orders />;
      case "radio-3":
        return <MyFavorites />;
      case "radio-4":
        return <MyPosts />;
      default:
        return <ProfileInfo />;
    }
  }; */
  const renderTabs = () => {
    return (
      <>
        {isLoggedInUser && (
          <>
            <input
              type="radio"
              id="radio-1"
              name="tabs"
              checked={selectedTab === "radio-1"}
              onChange={() => handleTabChange("radio-1")}
            />
            <label className="tab" htmlFor="radio-1">
              個人資料
            </label>

            <input
              type="radio"
              id="radio-2"
              name="tabs"
              checked={selectedTab === "radio-2"}
              onChange={() => handleTabChange("radio-2")}
            />
            <label className="tab" htmlFor="radio-2">
              訂單管理
            </label>
          </>
        )}
        <input
          type="radio"
          id="radio-3"
          name="tabs"
          checked={
            selectedTab === "radio-3" ||
            (!isLoggedInUser && selectedTab === "radio-1")
          }
          onChange={() => handleTabChange("radio-3")}
        />
        <label className="tab" htmlFor="radio-3">
          我的收藏
        </label>
        <input
          type="radio"
          id="radio-4"
          name="tabs"
          checked={selectedTab === "radio-4"}
          onChange={() => handleTabChange("radio-4")}
        />
        <label className="tab" htmlFor="radio-4">
          我的貼文
        </label>
      </>
    );
  };
  const calculateGliderTransform = () => {
    // 假设每个选项卡的宽度固定为160px，这个值根据你的实际布局调整
    const tabWidth = 160;
    // 根据用户的登录状态和选中的Tab来计算glider的位移
    let index = 0; // 默认情况下假设选中的是第一个选项卡
    if (!isLoggedInUser) {
      // 如果用户未登录，调整index以反映剩余选项卡的实际位置
      if (selectedTab === "radio-3") index = 0;
      if (selectedTab === "radio-4") index = 1;
    } else {
      // 如果用户已登录，根据选项卡的ID来确定index
      if (selectedTab === "radio-1") index = 0;
      if (selectedTab === "radio-2") index = 1;
      if (selectedTab === "radio-3") index = 2;
      if (selectedTab === "radio-4") index = 3;
    }
    return `translateX(${index * tabWidth}px)`;
  };

  const renderTabContent = () => {
    if (
      isLoggedInUser ||
      selectedTab === "radio-3" ||
      selectedTab === "radio-4"
    ) {
      switch (selectedTab) {
        case "radio-1":
          return <ProfileInfo userId={userId} />;
        case "radio-2":
          return <Orders userId={userId} />;
        case "radio-3":
          return <MyFavorites userId={userId} />;
        case "radio-4":
          return <MyPosts userId={userId} />;
        default:
          return null;
      }
    }
    return null;
  };
  return (
    <div>
      <div className="outerBackground">
        <div className="innerBackground">
          <div>
            <div>
              <img className="cit" src={bg} alt="backgroundImage" />
              <button className="profile-button">更換背景圖片</button>
            </div>
            <div className="card-body little-profile text-center">
              <div className="pro-img">
                <img src={profile} alt="profile" />
              </div>
              <h3>Lily CHU</h3>
              <span>@lilychu23</span>
              <div>
                <button style={{ marginTop: "20px" }} className="follow-btn">
                  Follow
                </button>
              </div>
            </div>
          </div>
          <div className="tabContainer">
            <div className="tabs">
              {renderTabs()}
              <span
                className="glider"
                style={{ transform: calculateGliderTransform() }}
              ></span>
            </div>
            <div className="tabContent ">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Member;
