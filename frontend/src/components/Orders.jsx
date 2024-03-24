import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/order.css";
import "@fontsource/inter";
import OrdersList from "./Orders copy";
import { FormControl, MenuItem, TextField } from "@mui/material";

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

function Orders({ userId }) {
  const [orders, setOrders] = useState([]);
  const [filterOption, setFilterOption] = useState("all");
  const [isFilterSide, setIsFilterSide] = useState(false);
  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    setIsFilterSide(!isFilterSide);
  };
  const filterOrders = orders
    .filter((order) => {
      const today = new Date();
      const endDate = new Date(order.endDate);
      const startDate = new Date(order.startDate);

      switch (filterOption) {
        case "past":
          return endDate < today;
        case "future":
          return startDate >= today;
        default:
          return true; // return all orders default
      }
    })
    .sort((a, b) => {
      const startDateA = new Date(a.startDate);
      const startDateB = new Date(b.startDate);
      return startDateB - startDateA;
    });

  useEffect(() => {
    localStorage.setItem("Uid", "10");
    const Uid = localStorage.getItem("Uid");
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/member/order/${Uid}`
        );
        const ordersWithTZ = response.data.map((order) => {
          return {
            ...order,
            startDate: convertToTz(order.startDate, "Asia/Taipei"),
            endDate: convertToTz(order.endDate, "Asia/Taipei"),
          };
        });

        //訂單已轉換時區，更新orders
        setOrders(ordersWithTZ);
        console.log(response.data);
        console.log(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);
  function convertToTz(dateStr, tzString) {
    const date = new Date(dateStr);
    const utcDate = new Date(date.toISOString());
    const tzOffset = new Date()
      .toLocaleString("en-US", { timeZone: tzString })
      .endsWith("PM")
      ? 8
      : 0;
    utcDate.setHours(utcDate.getHours() + tzOffset);
    return utcDate;
  }
  return (
    <div className="formContainer">
      <FilterForm
        filterOption={filterOption}
        handleFilterChange={handleFilterChange}
        isFilterSide={isFilterSide}
      />
      <OrdersList filterOrders={filterOrders} filterOption={filterOption} />
    </div>
  );
}
function FilterForm({ filterOption, handleFilterChange, isFilterSide }) {
  return (
    <FormControl
      sx={{ margin: 0.6 }}
      className={`formControl ${isFilterSide ? "animateToSide" : ""}`}
    >
      <TextField
        select
        label="選擇訂單"
        value={filterOption}
        onChange={handleFilterChange}
        SelectProps={{ displayEmpty: true }}
        rendervalue={(value) => (value === "" ? <em>所有訂單</em> : value)}
        sx={{
          "& .MuiInputBase-input": {
            fontSize: "15px",
          },
          marginTop: 1,
          marginBottom: 1,
        }}
      >
        <MenuItem value="all">所有訂單</MenuItem>
        <MenuItem value="past">已完成訂單</MenuItem>
        <MenuItem value="future">預約中訂單</MenuItem>
      </TextField>
    </FormControl>
  );
}

export default Orders;
