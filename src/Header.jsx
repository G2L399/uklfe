// Header.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import Page1 from "./Page1";
import Home from "./Home";
import Transaksi from "./Transaksi"
import Bruh from "./bruh";
import Cart from "./cart";
export default function Header() {
  return (
    <>
      <Routes>
        <Route path="/Page1" element={<Page1 />} />
        <Route exact path="/" element={<Home />} />
        <Route path="/transaksi" element={<Transaksi />} />
        <Route path="/buy" element={<Bruh />} />
        <Route path="/Cart" element={<Cart />} />
      </Routes>
    </>
  );
}
