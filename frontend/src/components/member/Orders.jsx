import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/order.css";
import "@fontsource/inter";
import OrdersList from "./OrdersListAll.jsx";
import { FormControl, MenuItem, TextField } from "@mui/material";

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
  console.log("FilterOrders:", orders);
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
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);
  console.log("ordersWithTZ", orders);

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
      <OrdersList
        filterOrders={filterOrders}
        filterOption={filterOption}
        hotelId={orders.hotelId}
      />
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
