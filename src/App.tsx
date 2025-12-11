import "./styles.css";
import React from "react";
// @ts-ignore
import Home from "./Home";
// @ts-ignore
import Layout from "./Layout";
// @ts-ignore
import Trang1 from "./Trang1";
// @ts-ignore
import Chitietsanpham from "./Chitietsanpham";
// @ts-ignore
import Trang2 from "./Trang2";
// @ts-ignore
import ListProducts from "./ListProducts";
// @ts-ignore
import ProductDetail from "./ProductDetail";
// @ts-ignore
import ListProducts_SP from "./ListProducts_SP";
// @ts-ignore
import About from "./About";
// @ts-ignore
import { CartProvider } from "./CartContext";
//@ts-ignore
import CartPage from "./CartPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//@ts-ignore
import RegisterPage from "./RegisterPage";
//@ts-ignore
import LoginPage from "./LoginPage";
//@ts-ignore
import LogoutPage from "./LogoutPage";
//@ts-ignore
import ProtectedRoute from "./ProtectedRoute";
//@ts-ignore
import ListProducts_SP_Admin from "./ListProducts_SP_Admin";
import AdminOrders from "./AdminOrders";
const App = () => {
  //return <Layout />;
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* ✅ Layout chung cho toàn bộ hệ thống */}
          <Route path="/" element={<Layout />}>
            {/* Trang chính (cho người dùng vãng lai) */}
            <Route index element={<Home />} />
            <Route path="sanpham" element={<ListProducts_SP />} />
            <Route path="trang1" element={<Trang1 />} />
            <Route path="trang2" element={<Trang2 />} />
            <Route path="sanpham/:id" element={<Chitietsanpham />} />
            <Route path="detail/:id" element={<ProductDetail />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="About" element={<About />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="logout" element={<LogoutPage />} />
            <Route
              path="admin/orders"
              element={
                <ProtectedRoute>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/products"
              element={
                <ProtectedRoute>
                  <ListProducts_SP_Admin />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
