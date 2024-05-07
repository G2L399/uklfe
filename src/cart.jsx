import React, { useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customerName, setCustomerName] = useState("Apalah");
  const [orderType, setOrderType] = useState("dine in");

  useEffect(() => {
    // Retrieve cart items from localStorage
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, []);

  // Calculate total price whenever cartItems changes
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      return acc + item.quantity * item.price;
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const handleRemoveItem = (itemId) => {
    // Filter out the item to remove
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    // Update state and localStorage
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const handleQuantityChange = (event, itemId) => {
    const { value } = event.target;
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: parseInt(value) };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const handleOrder = async () => {
    const currentDate = new Date();
    // Get the date in ISO string format
    const orderDateISOString = currentDate.toISOString();
    // Extract only the date part (YYYY-MM-DD)
    const orderDate = orderDateISOString.split("T")[0];
    const orderData = {
      customer_name: customerName,
      order_type: orderType,
      order_date: orderDate,
      order_detail: cartItems.map((item) => ({
        coffee_id: item.id,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/order",
        orderData
      );
      console.log("Order placed successfully:", response.data);
      // Optionally, you can clear the cart after successful order placement
      setCartItems([]);
      localStorage.removeItem("cartItems");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  const renderImage = (buffer) => {
    const base64String = btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return `data:image/jpeg;base64,${base64String}`;
  };
  return (
    <div className="container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="d-flex justify-content-center">
          {cartItems.map((item, index) => (
            <Card key={index} style={{ width: "18rem", margin: "10px" }}>
              <Card.Img variant="top" src={renderImage(item.image)} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  Price: ${item.price}
                  <br />
                  Quantity:{" "}
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => handleQuantityChange(event, item.id)}
                  />
                </Card.Text>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
      <h3>Total Price: ${totalPrice}</h3>
      <Card>
        <Card.Body>
          <Card.Title>Customer Information</Card.Title>
          <Form.Group controlId="customerName">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="orderType">
            <Form.Label>Order Type</Form.Label>
            <Form.Control
              as="select"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
            >
              <option value="Dine in">Dine In</option>
              <option value="Take away">Take Away</option>
            </Form.Control>
          </Form.Group>
          <h1>Grand Total: ${totalPrice + totalPrice * 0.1}</h1>
          <Button
            variant="primary"
            onClick={handleOrder}
            disabled={cartItems.length === 0}
          >
            Place Order
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Cart;
