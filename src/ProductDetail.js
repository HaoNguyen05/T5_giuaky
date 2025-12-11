import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useCart } from "./CartContext"; // ⭐ Import context giỏ hàng

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // ⭐ Lấy hàm addToCart từ context

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("product1") // Hoặc product2 nếu bạn muốn lấy từ bảng khác
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setProduct(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h3>Không tìm thấy sản phẩm!</h3>
        <button
          onClick={() => navigate("/trang1")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          Quay lại Trang 1
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product); // ⭐ Thêm sản phẩm vào giỏ hàng
    alert("Đã thêm vào giỏ hàng!"); // Thông báo
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ← Quay lại
      </button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        {/* Ảnh sản phẩm */}
        <div
          style={{
            flex: "1 1 300px",
            maxWidth: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <img
            src={product.image || "https://via.placeholder.com/250"}
            alt={product.title}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div style={{ flex: "1 1 300px" }}>
          <h2 style={{ marginBottom: "10px" }}>{product.title}</h2>

          <p
            style={{ fontSize: "1.2rem", color: "#e63946", fontWeight: "bold" }}
          >
            {product.price.toLocaleString("vi-VN")} VNĐ
          </p>

          {product.rating_rate !== undefined &&
            product.rating_count !== undefined && (
              <p style={{ marginTop: "10px", color: "#555" }}>
                ⭐ {product.rating_rate} ({product.rating_count} đánh giá)
              </p>
            )}

          {product.category && (
            <p>
              <strong>Loại:</strong> {product.category}
            </p>
          )}

          <p
            style={{
              marginTop: "20px",
              lineHeight: "1.6",
              color: "#333",
              textAlign: "justify",
            }}
          >
            {product.description || "Chưa có mô tả cho sản phẩm này."}
          </p>

          <button
            style={{
              marginTop: "20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={handleAddToCart} // ⭐ Gọi hàm addToCart
          >
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
