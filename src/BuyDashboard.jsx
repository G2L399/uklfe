import React, { useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";

const Bruh = () => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState(0);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const response = await axios.get("http://localhost:8000/coffee");
        setFlags(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flags:", error);
        setLoading(false);
      }
    };
    fetchFlags();
  }, []);

  const handleQuantityChange = (event, index) => {
    const { value } = event.target;
    setQuantities({ ...quantities, [index]: value });
  };

  const handleBuyNow = (index) => {
    const quantity = quantities[index] || 1; // Default quantity to 1 if not provided
    if (quantity <= 0) {
      alert("Quantity cannot be zero.");
      return;
    }
    const item = {
      id: flags[index].id,
      image: flags[index].image.data,
      name: flags[index].name,
      price: flags[index].price,
      quantity: quantity,
    };
    // Retrieve existing cart items from localStorage
    const existingItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingIndex = existingItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingIndex !== -1) {
      // If item exists, update its quantity
      existingItems[existingIndex].quantity += parseInt(quantity);
    } else {
      // If item doesn't exist, add it to the cart
      existingItems.push(item);
    }
    // Save updated cart items to localStorage
    localStorage.setItem("cartItems", JSON.stringify(existingItems));
    console.log(`Buying ${quantity} units of ${flags[index].name}`);
    // You can add your logic for purchasing here
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
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {flags.map((flag, index) => (
          <Card key={index} style={{ width: "18rem", margin: "10px",borderColor:"black",borderWidth:"5px"}}>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "15rem" }}>
              <Card.Img style={{maxHeight:"15rem",width:"auto",maxWidth:"15rem",outline:"5px solid black"}} variant="top" src={renderImage(flag.image.data)} />
            </div>
            <Card.Body style={{borderTop:"5px solid black"}}>
              <Card.Title>{flag.name}</Card.Title>
              <Card.Text>
                Size: {flag.size}
                <br  />
                Price: {flag.price}
              </Card.Text>
              <Form.Group controlId={`quantity-${index}`}>
                <Form.Label>Quantity:</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  defaultValue="1"
                  onChange={(event) => handleQuantityChange(event, index)}
                />
              </Form.Group>
              <Button variant="primary" onClick={() => handleBuyNow(index)}>
                Buy Now
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Bruh;
