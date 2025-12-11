import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useCart } from "./CartContext";

const ListProducts_SP = () => {
  const [listProduct, setListProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all"); // ⭐ CATEGORY FILTER

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("product1")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;

        setListProduct(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <h3>Đang tải dữ liệu...</h3>;

  // ⭐ LỌC THEO CATEGORY
  const filteredProducts =
    category === "all"
      ? listProduct
      : listProduct.filter((p) => p.category === category);

  return (
    <div style={{ padding: "20px 40px" }}>
      <h2 style={{ marginBottom: "20px" }}>Danh sách sản phẩm</h2>

      {/* ⭐ CATEGORY FILTER BUTTONS */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {["all", "Dell", "Lenovo", "Asus"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: "10px 18px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: category === cat ? "#007bff" : "#fff",
              color: category === cat ? "#fff" : "#333",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {cat === "all" ? "Tất cả" : cat}
          </button>
        ))}
      </div>

      {/* ⭐ LIST SẢN PHẨM */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
          width: "100%",
        }}
      >
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "15px",
              textAlign: "center",
              background: "#fff",
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              transition: "0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.1)";
            }}
          >
            {/* ẢNH */}
            <div
              onClick={() => navigate(`/detail/${p.id}`)}
              style={{
                width: "100%",
                height: "220px",
                overflow: "hidden",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <img
                src={p.image || "https://via.placeholder.com/200"}
                alt={p.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* THÔNG TIN */}
            <div style={{ marginTop: "12px" }}>
              <h4
                style={{
                  margin: "8px 0",
                  fontSize: "1.05rem",
                  fontWeight: "600",
                  minHeight: "45px",
                }}
              >
                {p.title}
              </h4>

              <p
                style={{
                  color: "#e63946",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  marginBottom: "5px",
                }}
              >
                {p.price.toLocaleString("vi-VN")} VNĐ
              </p>

              <small style={{ color: "#555" }}>
                ⭐ {p.rating_rate} | ({p.rating_count} đánh giá)
              </small>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => addToCart(p)}
              style={{
                marginTop: "15px",
                padding: "12px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
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

export default ListProducts_SP;
