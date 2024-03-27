import React, { useState, useEffect } from "react";
import "../../css/info.css";
import PaymentInfo from "./Payment"; //payment元件切出去了
import axios from "axios";

localStorage.setItem("Uid", "10");
function ProfileInfo({ userId }) {
  const [userInfo, setUserInfo] = useState([]); // null
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  useEffect(() => {
    const Uid = localStorage.getItem("Uid");
    fetchUserInfo(Uid);
  }, []);
  useEffect(() => {
    if (passwordUpdated) {
      const Uid = localStorage.getItem("Uid");
      fetchUserInfo(Uid);
      setPasswordUpdated(false);
    }
  }, [passwordUpdated]);
  const fetchUserInfo = async (Uid) => {
    if (!Uid) return;
    try {
      const response = await axios.get(
        `http://localhost:8000/member/info/basic/${Uid}`
      );
      setUserInfo(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user info: ", error);
    }
  };

  /*   const [name, setName] = useState(Info.lily.name); */
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const handleSave = (e) => {
    e.preventDefault();
    toggleEditMode();
    setLastName("");
    setFirstName("");
  };
  //姓名編輯框出現
  const [editMode, setEditMode] = useState(false);
  const toggleEditMode = () => setEditMode(!editMode);
  //showpassword，編輯框出現
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const [editMode2, setEditMode2] = useState(false);

  //查看模式時，密碼隱藏
  const toggleEditMode2 = () => {
    setEditMode2(!editMode2);
    if (editMode2) {
      setShowPassword(false);
    }
  };
  const [editMode3, setEditMode3] = useState(false);
  const toggleEditMode3 = () => {
    setEditMode3(!editMode3);
  };

  const [inputValue, setInputValue] = useState("");
  const handleSave2 = async (e) => {
    e.preventDefault();
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d{5,}).+$/;
    if (!regex.test(inputValue)) {
      alert("密碼需要至少包含一位大寫字母、一位小寫字母和五位數字。");
      return;
    }
    const Uid = localStorage.getItem("Uid");
    await changePassword(Uid, inputValue);
    toggleEditMode2();
    setInputValue("");
  };

  async function changePassword(Uid, newPassword) {
    try {
      const response = await axios.put(
        `http://localhost:8000/member/info/basic/update/${Uid}`,
        {
          password: newPassword,
        }
      );
      console.log(response.data);
      setPasswordUpdated(true);
    } catch (error) {
      console.error("Error updating password:", error.response?.data);
    }
  }

  const [inputValue3, setInputValue3] = useState("");
  const [email, setEmail] = useState(userInfo.email);
  const handleSave3 = async (e) => {
    e.preventDefault();
    const regex =
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    if (!regex.test(inputValue3)) {
      alert("請輸入正確格式的email。");
      return;
    }

    const Uid = localStorage.getItem("Uid") || "10";

    try {
      await axios.put(
        `http://localhost:8000/member/info/basic/updateEmail/${Uid}`,
        {
          email: inputValue3,
        }
      );

      alert("email updated successfully");
      setEmail(inputValue3);
      toggleEditMode3();
      setInputValue3("");
      setEmailUpdated(true);
    } catch (error) {
      console.error("Error updating email:", error.response?.data || error);
      alert("email updated failed");
    }
  };

  const [emailUpdated, setEmailUpdated] = useState(false);

  useEffect(() => {
    if (emailUpdated) {
      const Uid = localStorage.getItem("Uid");
      fetchUserInfo(Uid);
      setEmailUpdated(false); // Reset the flag after fetching
    }
  }, [emailUpdated]); // Add emailUpdated to the dependency array
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("zh-Hans-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
  };

  return (
    <React.Fragment>
      {userInfo.length > 0 && (
        <div className="infoBox">
          <h2>個人資訊</h2>
          <div className="profile-box">
            <div className="row">
              <div
                className="col-lg-6 col-sm-12"
                style={{ paddingRight: "30px" }}
              >
                <div className="profile-card">
                  <div className="form-box">
                    <label className="form-label">姓名</label>
                    <div className="form-edit" onClick={toggleEditMode}>
                      {editMode ? "取消" : "編輯"}
                    </div>
                  </div>
                  <div className="profile-info">{userInfo[0].name}</div>
                  {editMode && (
                    <React.Fragment>
                      <div
                        tabIndex={0}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <form>
                          <div
                            style={{
                              display: "flex",
                              marginBottom: "10px",
                              marginTop: "10px",
                            }}
                          >
                            <input
                              type="text"
                              id="lname"
                              name="lname"
                              className="nameInput"
                              placeholder="姓氏"
                              onChange={(e) => setLastName(e.target.value)}
                            />

                            <input
                              type="text"
                              id="fname"
                              name="fname"
                              placeholder="名字"
                              className="nameInput"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </div>

                          <button className="inputButton" onClick={handleSave}>
                            儲存
                          </button>
                        </form>
                      </div>
                    </React.Fragment>
                  )}
                </div>
                <div className="profile-card">
                  <div className="form-box">
                    <label className="form-label">密碼</label>
                    <div className="form-edit" onClick={toggleEditMode2}>
                      {editMode2 ? "取消" : "編輯"}
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="profile-info">
                      {showPassword
                        ? userInfo.length > 0
                          ? userInfo[0].password
                          : ""
                        : userInfo.length > 0
                        ? "●".repeat(userInfo[0].password.length)
                        : ""}
                    </div>
                    <div
                      className="form-edit"
                      onClick={handleClickShowPassword}
                    >
                      <i
                        className={`bi ${
                          showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                        }`}
                      ></i>
                    </div>
                  </div>
                  {editMode2 && (
                    <React.Fragment>
                      <div tabIndex={1}>
                        <form>
                          <div
                            style={{
                              marginBottom: "10px",
                              marginTop: "10px",
                            }}
                          >
                            <input
                              type="text"
                              id="password"
                              name="password"
                              className="normalInput"
                              placeholder="密碼"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                            />
                          </div>

                          <button className="inputButton" onClick={handleSave2}>
                            儲存
                          </button>
                        </form>
                      </div>
                    </React.Fragment>
                  )}
                </div>
                <div className="profile-card">
                  <div className="form-box">
                    <label className="form-label">電子郵件</label>
                    <div className="form-edit" onClick={toggleEditMode3}>
                      {editMode3 ? "取消" : "編輯"}
                    </div>
                  </div>
                  <div className="profile-info">{userInfo[0].email}</div>
                  {editMode3 && (
                    <React.Fragment>
                      <div tabIndex={3}>
                        <form>
                          <div
                            style={{
                              marginBottom: "10px",
                              marginTop: "10px",
                            }}
                          >
                            <input
                              type="text"
                              className="normalInput"
                              placeholder="電子郵件"
                              value={inputValue3}
                              onChange={(e) => setInputValue3(e.target.value)}
                            />
                          </div>

                          <button className="inputButton" onClick={handleSave3}>
                            儲存
                          </button>
                        </form>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="profile-card">
                  <div className="form-box">
                    <label className="form-label">地址</label>
                    <div className="form-edit">編輯</div>
                  </div>
                  <div className="profile-info">{userInfo[0].address}</div>
                </div>
                <div className="profile-card">
                  <div className="form-box">
                    <label className="form-label">生日</label>
                    <div className="form-edit">編輯</div>
                  </div>
                  <div className="profile-info">
                    {formatDate(userInfo[0].birthday)}
                  </div>
                </div>
                <div className="profile-card">
                  <div className="form-box">
                    <label className="form-label">手機號碼</label>
                    <div className="form-edit">編輯</div>
                  </div>
                  <div className="profile-info">{userInfo[0].telephone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {userInfo.length > 0 && <PaymentInfo />}
    </React.Fragment>
  );
}

export default ProfileInfo;
