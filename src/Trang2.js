// src/pages/LienHe.tsx
import React from "react";

export default function LienHe() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>💬 Liên hệ với chúng tôi</h2>

        <p style={{ marginBottom: 10 }}>
          Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ qua biểu mẫu dưới đây.
        </p>

        <form style={{ marginTop: 20 }}>
          <label>Họ và tên:</label>
          <input type="text" placeholder="Nhập họ tên" style={styles.input} />

          <label>Email:</label>
          <input type="email" placeholder="Nhập email" style={styles.input} />

          <label>Nội dung:</label>
          <textarea
            placeholder="Viết nội dung cần liên hệ..."
            rows={5}
            style={styles.textarea}
          />

          <button style={styles.button}>Gửi liên hệ</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0 16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    margin: "8px 0 16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
