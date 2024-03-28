import React, { useState, useEffect } from "react";
import "../../css/info.css";
import VisaImage from "../images/Visa.png";
import MasterCardImage from "../images/MasterCard.png";
import AmericanExpressImage from "../images/AmericanExpress.png";
import { Modal, TextField, MenuItem } from "@mui/material";
import axios from "axios";

function PaymentInfo() {
  const [creditCardInfo, setCreditCardInfo] = useState([]);
  console.log(creditCardInfo);
  const Uid = localStorage.getItem("Uid") || "10";
  const fetchCreditCardInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/member/info/card/${Uid}`
      );
      setCreditCardInfo(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching credit card info:", error);
    }
  };
  useEffect(() => {
    if (Uid) {
      fetchCreditCardInfo();
    }
  }, [Uid]); // 依賴陣列中包括userId，當userId變化時會重新執行

  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    valid: "", // 有效期限
    cvv: "",
  });
  const deletecard = async (creditId) => {
    try {
      await axios.delete(
        `http://localhost:8000/member/info/card/${Uid}/${creditId}`
      );
      alert(`已刪除信用卡！`);
      fetchCreditCardInfo();
    } catch (error) {
      console.error("Error deleting card:", error);
      alert("刪除失敗");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    //const Uid = localStorage.getItem("Uid");
    // 檢查是否是卡號輸入，並且長度適合於檢測卡片類型
    if (name === "cardNumber") {
      if (value.replace(/\s+/g, "").length >= 15) {
        const detectedCardType = detectCardType(value);
        setCardType(detectedCardType);
      } else {
        setCardType(""); // 如果卡號長度不足，則重置卡片類型
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const completeCardInfo = {
      ...cardInfo,
      cardType,
      Uid,
    };
    try {
      const response = await axios.post(
        `http://localhost:8000/member/info/card/${Uid}`,
        completeCardInfo
      );
      if (response.status === 201) {
        console.log("Card information successfully posted.", response.data);
        setOpen(false);
      } else {
        console.log(
          "POST request was made, but the status code is not 201:",
          response.status
        );
        setOpen(false);
        fetchCreditCardInfo();
      }
    } catch (error) {
      console.error("Submitting credit card information failed", error);
      if (error.response) {
        console.error("Error data", error.response.data);
        console.error("Error status", error.response.status);
      } else if (error.request) {
        console.error("No response received", error.request);
      } else {
        console.error("Error message", error.message);
      }
    }
  };

  const [cardType, setCardType] = useState("");
  const cardImages = {
    Visa: VisaImage,
    MasterCard: MasterCardImage,
    "American Express": AmericanExpressImage,
  };
  const detectCardType = (number) => {
    const regexMap = [
      { regex: /^4[0-9]{12}(?:[0-9]{3})?$/, type: "Visa" },
      { regex: /^5[1-5][0-9]{14}$/, type: "MasterCard" },
      { regex: /^3[47][0-9]{13}$/, type: "American Express" },
      { regex: /^(?:2131|1800|35\d{3})\d{11}$/, type: "JCB" },
    ];

    for (let i = 0; i < regexMap.length; i++) {
      if (number.match(regexMap[i].regex)) {
        return regexMap[i].type;
      }
    }
  };

  const getCardImage = (cardType) => {
    switch (cardType) {
      case "Visa":
        return VisaImage;
      case "MasterCard":
        return MasterCardImage;
      case "American Express":
        return AmericanExpressImage;
      default:
        return null;
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    border: "2px solid #3c93d6",
    boxShadow: "24",
    borderRadius: "20px",
    padding: "30px 30px",
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedCountry, setSelectedCountry] = useState("台灣");
  const country = [
    {
      value: "美國",
      label: "美國",
    },
    {
      value: "日本",
      label: "日本",
    },
    {
      value: "英國",
      label: "英國",
    },
    {
      value: "韓國",
      label: "韓國",
    },
    {
      value: "台灣",
      label: "台灣",
    },
    {
      value: "新加坡",
      label: "新加坡",
    },

    {
      value: "德國",
      label: "德國",
    },
    {
      value: "荷蘭",
      label: "荷蘭",
    },
    {
      value: "冰島",
      label: "冰島",
    },
    {
      value: "巴西",
      label: "巴西",
    },
    {
      value: "阿根廷",
      label: "阿根廷",
    },
  ];
  const handleChangecountry = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div className="infoBox" style={{ marginBottom: "150px" }}>
      <div className="addcard">
        <h2 style={{ fontWeight: "bold" }}>付款資訊</h2>
        {creditCardInfo.length < 3 ? (
          <h6
            className="inputButton-outline"
            onClick={handleOpen}
            style={{ fontWeight: "bold" }}
          >
            新增信用卡
          </h6>
        ) : (
          <h6
            className="inputButton-outline-delete"
            style={{ fontWeight: "bold" }}
          >
            最多新增三張信用卡，點擊刪除
          </h6>
        )}
      </div>

      <div className="d-flex cardbox" style={{ alignItems: "center" }}>
        {creditCardInfo.map((card, index) => (
          <div key={index} style={{ margin: "10px" }}>
            {getCardImage(card.cardType) && (
              <img
                src={getCardImage(card.cardType)}
                alt={card.cardType}
                style={{ cursor: "pointer" }}
                onClick={() => deletecard(card.creditId)}
              />
            )}
          </div>
        ))}
        {/* <div className="card-full-container">
          <div>
            <button
              className="add-button"
              style={{ marginTop: "5px", pointer: "cursor" }}
              onClick={handleOpen}
            >
              +
            </button>
            <div style={{ marginTop: "5px" }}>新增信用卡</div>
          </div>
        </div>
        */}
        <div>
          <Modal open={open} onClose={handleClose}>
            <div style={style}>
              <form>
                <div>
                  <h2
                    className="addText text-center"
                    style={{ fontWeight: "bold" }}
                  >
                    新增信用卡
                  </h2>
                </div>
                <div style={{ marginTop: "25px" }}>
                  <div
                    className="d-flex"
                    style={{ alignItems: "stretch", width: "100%" }}
                  >
                    <div
                      style={{
                        flexGrow: 1,
                        marginRight: cardType ? "16px" : "0",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        name="cardNumber"
                        label="卡號"
                        variant="outlined"
                        value={cardInfo.cardNumber}
                        onChange={handleInputChange}
                        style={{ width: "100%" }}
                      />
                      {/* <input
                          type="text"
                          className="normalInput"
                          placeholder="Enter credit card number"
                        /> */}
                    </div>
                    <div>
                      {cardType && (
                        <div style={{ flexShrink: 0 }}>
                          <img
                            style={{ maxHeight: "56px" }}
                            src={cardImages[cardType]}
                            alt={cardType}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="d-flex">
                    <div
                      className="card-form-info "
                      style={{ marginRight: "3px" }}
                    >
                      <TextField
                        id="outlined-basic"
                        label="有效期限"
                        name="valid"
                        placeholder="月月/年年"
                        onChange={handleInputChange}
                        variant="outlined"
                        value={cardInfo.valid}
                      />
                    </div>
                    <div className="card-form-info">
                      <TextField
                        id="outlined-basic"
                        label="安全碼"
                        name="cvv"
                        placeholder="123"
                        onChange={handleInputChange}
                        variant="outlined"
                        value={cardInfo.cvv}
                      />
                    </div>
                  </div>
                  <div className="card-form-info">
                    <TextField
                      id="outlined-basic"
                      label="郵遞區號"
                      variant="outlined"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="card-form-info">
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="國家"
                      style={{ width: "100%" }}
                      value={selectedCountry}
                      onChange={handleChangecountry}
                    >
                      {country.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </div>
                <div className="card-form-info">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="form-button-cancel"
                  >
                    取消
                  </button>
                  <div style={{ marginLeft: "auto" }}>
                    <button className="form-button" onClick={handleSubmit}>
                      確認
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default PaymentInfo;
