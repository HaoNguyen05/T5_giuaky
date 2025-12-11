// src/Chitietsanpham.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useCart } from "./CartContext"; // ⭐ Import context giỏ hàng

export default function Chitietsanpham() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // ⭐ Lấy hàm addToCart từ context

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("product2")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <h3>Đang tải...</h3>;

  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Không tìm thấy sản phẩm!</h3>
        <button onClick={() => navigate("/trang1")}>Quay lại Trang 1</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product); // ⭐ Thêm sản phẩm vào giỏ hàng
    alert("Đã thêm vào giỏ hàng!"); // Thông báo
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ⬅ Quay lại
      </button>

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {/* Ảnh sản phẩm */}
        <img
          src={product.image || "https://via.placeholder.com/250"}
          alt={product.title}
          style={{ width: "250px", height: "250px", objectFit: "contain" }}
        />

        {/* Thông tin sản phẩm */}
        <div>
          <h2>{product.title}</h2>

          <p>
            <strong>Giá:</strong> {product.price.toLocaleString("vi-VN")} VNĐ
          </p>

          {product.category && (
            <p>
              <strong>Loại:</strong> {product.category}
            </p>
          )}

          <p style={{ maxWidth: "400px", marginTop: "10px" }}>
            {product.description || "Chưa có mô tả cho sản phẩm này."}
          </p>

          {/* ⭐ Nút thêm vào giỏ hàng */}
          <button
            onClick={handleAddToCart}
            style={{
              marginTop: "15px",
              padding: "10px 16px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
