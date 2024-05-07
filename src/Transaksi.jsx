import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";

const Transaksi = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [coffeeIDs, setCoffeeIDs] = useState([]);
  const [coffeeData, setCoffeeData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/order");
      const orderData = response.data.data;
      let totalPrice = 0;
      let coffeeIDsArray = [];

      orderData.forEach((order) => {
        order.orderID.forEach((orderID) => {
          totalPrice += orderID.price;
          coffeeIDsArray.push(orderID.coffee_id);
        });

      });

      setOrders(orderData);
      setTotal(totalPrice);
      setCoffeeIDs(coffeeIDsArray);
      const coffeePromises = coffeeIDsArray.map(async coffeeID => {
        const coffeeResponse = await axios.get(`http://localhost:8000/coffee/${coffeeID}`);
        return coffeeResponse.data;
      });

      const coffeeDataArray = await Promise.all(coffeePromises);
      setCoffeeData(coffeeDataArray);
      console.log(coffeeData);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <Table bordered hover style={{borderColor: 'black',borderWidth:"5px"}}>
        <thead>
          <tr>
            <th>No</th>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Order type</th>
            <th>Detail Order</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{order.order_date}</td>
              <td>{order.customer_name}</td>
              <td>{order.order_type}</td>
              <td>
                {order.orderID.map((orderID, idx) => (
                  <div key={idx}>
                    <p>{`Nama: ${coffeeData[idx]?.data.name}, Size: ${coffeeData[idx]?.data.size}, Quantity: ${orderID.quantity}`}</p>
                  </div>
                ))}
              </td>
              <td>{order.total_price}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Transaksi;
