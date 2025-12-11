import React, { useEffect, useState } from "react";
import "./assets/css/home.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  rating_rate?: number;
  rating_count?: number;
  description?: string;
};

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [topSold, setTopSold] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [hotDeals, setHotDeals] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Laptop Chính Hãng – Giá Tốt Nhất",
      desc: "Hàng mới 100%, bảo hành toàn quốc, hỗ trợ trả góp 0%",
      img: "https://file.hstatic.net/200000722513/file/gearvn-laptop-gaming-t8-header-banner.png",
    },
    {
      id: 2,
      title: "Deal Sốc Cuối Tuần",
      desc: "Giảm đến 40% cho laptop gaming",
      img: "https://media.loveitopcdn.com/38138/laptopgamingdannang-lap24h.jpeg",
    },
    {
      id: 3,
      title: "Ưu Đãi Sinh Viên",
      desc: "Giảm thêm 10% khi mua laptop học tập",
      img: "https://sondat.vn/upload/data/images/TU-VAN-KINH-NGHIEM-SU-DUNG/chon-mua-laptop-choi-game-nen-mua-hang-nao-cau-hinh-bao-nhieu-la-du/chon-mua-laptop-choi-game-nen-mua-hang-nao-cau-hinh-bao-nhieu-la-du-10.jpg",
    },
  ];

  // Tự động chuyển slide
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const fetchTopSold = async () => {
    const { data } = await supabase
      .from("product1")
      .select("*")
      .order("rating_count", { ascending: false })
      .limit(4);
    if (data) setTopSold(data);
  };

  const fetchNewProducts = async () => {
    const { data } = await supabase
      .from("product1")
      .select("*")
      .order("id", { ascending: false })
      .limit(4);
    if (data) setNewProducts(data);
  };

  const fetchHotDeals = async () => {
    const { data } = await supabase
      .from("product1")
      .select("*")
      .order("rating_rate", { ascending: false })
      .limit(4);
    if (data && data.length > 0) setHotDeals(data);
    else setHotDeals(topSold);
  };

  useEffect(() => {
    fetchTopSold();
    fetchNewProducts();
    fetchHotDeals();
  }, []);

  // ⭐ Tìm kiếm sản phẩm theo tên
  const handleSearch = async () => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    const { data, error } = await supabase
      .from("product1")
      .select("*")
      .ilike("title", `%${search}%`);
    if (error) {
      console.error("Lỗi tìm kiếm:", error.message);
    } else {
      setSearchResults(data || []);
    }
  };

  const goDetail = (id: number) => navigate(`/detail/${id}`);

  const renderProducts = (items: Product[]) =>
    items.map((p) => (
      <div className="product-card" key={p.id} onClick={() => goDetail(p.id)}>
        <img src={p.image} alt={p.title} />
        <h4>{p.title}</h4>
        <p className="price">{p.price.toLocaleString()} đ</p>
      </div>
    ));

  return (
    <div className="home-wrapper">
      {/* ========= SLIDER ========= */}
      <div className="slider-container">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`slide ${i === slideIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${s.img})` }}
          >
            <div className="slide-text">
              <h1>{s.title}</h1>
              <p>{s.desc}</p>
              <button
                onClick={() => navigate("/sanpham")}
                className="btn-banner"
              >
                Mua ngay
              </button>
            </div>
          </div>
        ))}

        {/* dots */}
        <div className="slider-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === slideIndex ? "active" : ""}`}
              onClick={() => setSlideIndex(i)}
            ></span>
          ))}
        </div>
      </div>

      {/* ========= SEARCH ========= */}
      <div className="search-bar">
        <input
          placeholder="🔍 Tìm laptop theo tên, hãng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Enter để tìm kiếm
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
      </div>

      {/* ========= SEARCH RESULTS ========= */}
      {searchResults.length > 0 && (
        <section className="home-section">
          <h2>🔎 Kết quả tìm kiếm</h2>
          <div className="product-row">{renderProducts(searchResults)}</div>
        </section>
      )}

      {/* ========= HOT DEAL ========= */}
      <section className="home-section">
        <h2>🔥 Khuyến Mãi HOT</h2>
        <div className="product-row">{renderProducts(hotDeals)}</div>
      </section>

      {/* ========= TOP SOLD ========= */}
      <section className="home-section">
        <h2>💻 Laptop Bán Chạy</h2>
        <div className="product-row">{renderProducts(topSold)}</div>
      </section>

      {/* ========= NEW ========= */}
      <section className="home-section">
        <h2>🆕 Sản phẩm mới</h2>
        <div className="product-row">{renderProducts(newProducts)}</div>
      </section>
    </div>
  );
}
