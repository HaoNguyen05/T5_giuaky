import { Outlet, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "./assets/images/Logo.png";
import "./assets/css/layout.css";
import { useCart } from "./CartContext";

const Layout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Lấy giỏ hàng từ context
  const { cartItems } = useCart();

  // Tổng số lượng sản phẩm
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="modern-layout">
      {/* --- HEADER --- */}
      <header className="modern-header glass">
        <div className="header-left">
          <Link to="/">
            <img src={logo} alt="Logo" className="header-logo" />
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/sanpham">Sản Phẩm</Link>
          <Link to="/trang1">Phụ Kiện</Link>
          {user?.role === "admin" && (
            <>
              <Link to="/admin/products">Quản trị sản phẩm</Link>
              <Link to="/admin/orders">Quản lý đơn hàng</Link>
            </>
          )}

          <Link to="/trang2">Liên Hệ</Link>
          <Link to="/About">Giới Thiệu</Link>

          {/* --- GIỎ HÀNG --- */}
          <Link
            to="/cart"
            className="menu-item"
            style={{
              fontWeight: "bold",
              color: "#000",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            🛒 Giỏ hàng
            {totalQuantity > 0 && (
              <span
                style={{
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  marginLeft: "5px",
                }}
              >
                {totalQuantity}
              </span>
            )}
          </Link>
        </nav>

        <div className="header-right">
          {user ? (
            <div className="user-info">
              <span className="user-name">👤 {user.username}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Đăng nhập
            </Link>
          )}
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="modern-content">
        <div className="page-container">
          <Outlet />
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="modern-footer">
        <div className="footer-container">
          <div className="footer-logo">
            <img src={logo} alt="Logo" className="footer-logo-img" />
          </div>

          <div className="footer-links">
            <Link to="/">Trang chủ</Link>
            <Link to="/sanpham">Sản phẩm</Link>
            <Link to="/trang1">Phụ Kiện</Link>
            <Link to="/about">Giới thiệu</Link>
            <Link to="/trang2">Liên hệ</Link>
            {user?.role === "admin" && (
              <>
                <Link to="/admin/products">Quản trị sản phẩm</Link>
                <Link to="/admin/orders">Quản lý đơn hàng</Link>
              </>
            )}
          </div>
          <div className="footer-copyright">
            <p>© 2025 - StoreH | Thiết kế bởi Nguyễn Công Hảo</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
