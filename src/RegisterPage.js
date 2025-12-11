import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import anhlogo1 from "./assets/images/account.png";
import "./assets/css/Login.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu thiếu thông tin
    if (
      !username.trim() ||
      !password.trim() ||
      !fullname.trim() ||
      !email.trim()
    ) {
      alert("❌ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Kiểm tra độ dài mật khẩu phải lớn hơn 6 ký tự
    if (password.length < 6) {
      alert("❌ Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // Kiểm tra mật khẩu có ít nhất một chữ cái và một số
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      alert("❌ Mật khẩu phải có ít nhất một chữ cái và một chữ số!");
      return;
    }

    setLoading(true);

    try {
      // Kiểm tra tên đăng nhập đã tồn tại chưa
      const { data: existingUser, error } = await supabase
        .from("account")
        .select("id")
        .eq("username", username)
        .single();

      if (existingUser) {
        alert("❌ Tên đăng nhập đã tồn tại!");
        setLoading(false);
        return;
      }

      // Hash mật khẩu
      const sha256 = async (text) => {
        const buf = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(text)
        );
        return Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      };

      const passwordHash = await sha256(password);

      // Lấy ID role mặc định là 'user' từ bảng 'role'
      const { data: roleData, error: roleError } = await supabase
        .from("role")
        .select("id")
        .eq("role_name", "user")
        .single();

      if (roleError || !roleData) {
        alert("⚠️ Lỗi khi lấy vai trò mặc định!");
        setLoading(false);
        return;
      }

      // Thêm người dùng mới vào bảng 'account'
      const { data, error: insertError } = await supabase
        .from("account")
        .insert([
          {
            username,
            password_hash: passwordHash,
            fullname,
            email,
            role_id: roleData.id, // Gán role_id lấy từ bảng 'role'
          },
        ]);

      if (insertError) {
        alert("⚠️ Lỗi khi đăng ký tài khoản!");
        setLoading(false);
        return;
      }

      alert(`✅ Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.`);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("⚠️ Lỗi hệ thống khi đăng ký!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card shadow">
        <img src={anhlogo1} alt="Logo" className="login-logo" />
        <h2 className="login-title">Đăng ký</h2>
        <p className="login-subtitle">Tạo tài khoản mới</p>

        <form onSubmit={handleRegister} className="login-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên..."
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "⏳ Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <p className="register-link">
          Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
