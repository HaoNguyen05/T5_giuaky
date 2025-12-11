import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useCart } from "./CartContext";

const Trang1 = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("product2") // ⭐ LẤY TỪ BẢNG product2
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;
        setProducts(data);
      } catch (err) {
        console.error("Lỗi lấy product2:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <h3>Đang tải dữ liệu...</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách sản phẩm</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
              background: "white",
            }}
          >
            <div
              onClick={() => navigate(`/sanpham/${p.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={p.image || "https://via.placeholder.com/200"}
                alt={p.title}
                style={{ height: "140px", objectFit: "contain" }}
              />
              <h4>{p.title}</h4>
              <p>{p.price.toLocaleString("vi-VN")} VNĐ</p>
            </div>

            {/* Nút thêm vào giỏ hàng */}
            <button
              onClick={() => addToCart(p)}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "10px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🛒 Thêm vào giỏ hàng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trang1;
