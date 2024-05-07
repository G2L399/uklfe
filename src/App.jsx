// App.js
import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const App = () => {
    return (
      <>
        <div className="d-flex justify-content-evenly h5">
          <Link to="/">Home</Link>|
          <Link to="/Page1">Page1</Link>|
          <Link to="/transaksi">Transaksi</Link>|
          <Link to="/buy">Buy</Link>|
          <Link to="/Cart">Cart</Link>
        </div>
        <Header />
      </>
    );
  
}

export default App;
