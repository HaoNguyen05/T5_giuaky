import React, { useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; // Supabase client

export default function CartPage() {
  const {
    cartItems,
    totalPrice,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    note: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  if (cartItems.length === 0 && !orderSuccess)
    return (
      <div style={styles.centerBox}>
        <h3>Giỏ hàng trống</h3>
        <button onClick={() => navigate("/")} style={styles.secondaryButton}>
          ⬅ Quay lại mua hàng
        </button>
      </div>
    );

  const handleConfirmOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ!");
      return;
    }

    const order_code = "DH" + Date.now(); // Tạo mã đơn hàng
    const orderData = {
      order_code,
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_address: customerInfo.address,
      email: customerInfo.email,
      note: customerInfo.note,
      items: JSON.stringify(cartItems),
      total_price: totalPrice,
    };

    // Lưu vào Supabase (orders table)
    const { data, error } = await supabase.from("orders").insert([orderData]);

    if (error) {
      console.error("Lỗi lưu đơn hàng:", error.message);
      alert("❌ Thanh toán thất bại, vui lòng thử lại!");
      return;
    }

    clearCart();
    setOrderSuccess(true);

    // Giữ modal mở và chuyển về trang chủ sau 3 giây
    setTimeout(() => navigate("/"), 3000);
  };

  return (
    <div style={styles.container}>
      <h2>Giỏ hàng ({cartItems.length})</h2>

      <table style={styles.table}>
        <thead>
          <tr style={styles.theadTr}>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>SL</th>
            <th>Thành tiền</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.product.id}>
              <td style={styles.productCell}>
                <img
                  src={item.product.image}
                  width={50}
                  height={50}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                />
                <span style={{ marginLeft: 10 }}>{item.product.title}</span>
              </td>
              <td style={styles.centerText}>
                {item.product.price.toLocaleString()} VND
              </td>
              <td style={styles.centerText}>
                <button
                  onClick={() => decreaseQuantity(item.product.id)}
                  style={styles.qtyBtn}
                >
                  -
                </button>
                <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.product.id)}
                  style={styles.qtyBtn}
                >
                  +
                </button>
              </td>
              <td style={{ ...styles.centerText, fontWeight: "bold" }}>
                {(item.product.price * item.quantity).toLocaleString()} VND
              </td>
              <td style={styles.centerText}>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  style={styles.deleteBtn}
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.checkoutBox}>
        <button onClick={() => navigate("/")} style={styles.secondaryButton}>
          ⬅ Tiếp tục mua sắm
        </button>
        <div style={{ textAlign: "right" }}>
          <h3>
            Tổng cộng:{" "}
            <span style={{ color: "#d32f2f" }}>
              {totalPrice.toLocaleString()} VND
            </span>
          </h3>
          <button
            onClick={() => setShowCheckoutForm(true)}
            style={styles.primaryButton}
          >
            Thanh toán ngay
          </button>
        </div>
      </div>

      {/* Modal Thanh toán & thông báo thành công */}
      {(showCheckoutForm || orderSuccess) && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {orderSuccess ? (
              <>
                <h2 style={{ color: "green", textAlign: "center" }}>
                  🎉 Thanh toán thành công!
                </h2>
                <p style={{ textAlign: "center" }}>
                  Bạn sẽ được chuyển về trang chủ trong giây lát...
                </p>
              </>
            ) : (
              <>
                <h3>Thông tin khách hàng</h3>
                <button
                  onClick={() => setShowCheckoutForm(false)}
                  style={styles.closeBtn}
                >
                  ✖
                </button>
                <input
                  placeholder="Họ tên *"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleChange}
                  style={styles.input}
                />
                <input
                  placeholder="Số điện thoại *"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleChange}
                  style={styles.input}
                />
                <input
                  placeholder="Địa chỉ *"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleChange}
                  style={styles.input}
                />
                <input
                  placeholder="Email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleChange}
                  style={styles.input}
                />
                <textarea
                  placeholder="Ghi chú"
                  name="note"
                  value={customerInfo.note}
                  onChange={handleChange}
                  style={styles.textarea}
                />
                <button
                  onClick={handleConfirmOrder}
                  style={styles.primaryButton}
                >
                  Xác nhận đặt hàng
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- styles giữ nguyên ---
const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: 20 },
  centerBox: { textAlign: "center", marginTop: 50 },
  table: { width: "100%", borderCollapse: "collapse", marginTop: 20 },
  theadTr: { background: "#f0f0f0" },
  productCell: { padding: 10, display: "flex", alignItems: "center" },
  centerText: { textAlign: "center" },
  qtyBtn: {
    padding: "3px 8px",
    background: "#ddd",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  deleteBtn: {
    color: "red",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 16,
  },
  secondaryButton: {
    padding: "10px 20px",
    background: "white",
    border: "1px solid #ccc",
    cursor: "pointer",
    borderRadius: 6,
    marginRight: 10,
  },
  primaryButton: {
    padding: "12px 24px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: 10,
  },
  checkoutBox: {
    marginTop: 30,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "90%",
    maxWidth: 500,
    position: "relative",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "none",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    color: "#888",
  },
  input: {
    padding: 10,
    borderRadius: 4,
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    padding: 10,
    borderRadius: 4,
    border: "1px solid #ccc",
    width: "100%",
    height: 80,
    boxSizing: "border-box",
  },
};
