
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [ads, setAds] = useState([]);
  const [images, setImages] = useState({});
  const [searchText, setSearchText] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadAds(search = "", city = "", category = "") {
    setLoading(true);

    let query = supabase
      .from("listings")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (search.trim()) {
      const safeSearch = search.trim().replace(/[,%()]/g, " ");
      query = query.or(
        `title.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`
      );
    }

    if (city) {
      query = query.eq("city", city);
    }

    if (category) {
      query = query.eq("category_id", Number(category));
    }

    const { data, error } = await query;

    if (error) {
      console.error("خطا در دریافت آگهی‌ها:", error);
      setLoading(false);
      return;
    }

    const items = data || [];
    setAds(items);

    if (items.length === 0) {
      setImages({});
      setLoading(false);
      return;
    }

    const { data: imageData, error: imageError } = await supabase
      .from("listing_images")
      .select("listing_id, image_url")
      .in("listing_id", items.map((item) => item.id));

    if (imageError) {
      console.error("خطا در دریافت عکس‌ها:", imageError);
    }

    const imageMap = {};

    (imageData || []).forEach((img) => {
      if (!imageMap[img.listing_id]) {
        imageMap[img.listing_id] = img.image_url;
      }
    });

    setImages(imageMap);
    setLoading(false);
  }

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("id");

      if (error) {
        console.error("خطا در دریافت دسته‌بندی‌ها:", error);
        return;
      }

      setCategories(data || []);
    }

    loadCategories();
    loadAds();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    loadAds(searchText, selectedCity, selectedCategory);
  }

  function clearSearch() {
    setSearchText("");
    setSelectedCity("");
    setSelectedCategory("");
    loadAds();
  }

  return (
    <main className="site" dir="rtl">
      <header className="topbar">
        <div className="brand">🛍️ بازارک</div>

        <nav>
          <Link href="/">صفحه اصلی</Link>
          <a href="#categories">دسته‌بندی‌ها</a>
          <a href="#ads">آگهی‌ها</a>
          <a href="#">درباره ما</a>
          <a href="#">تماس با ما</a>
        </nav>

        <div className="header-actions">
          <Link className="login" href="/login">
            ورود / ثبت‌نام
          </Link>
          <Link className="post-ad" href="/new-ad">
            ＋ ثبت آگهی رایگان
          </Link>
        </div>
      </header>

      <section className="hero-banner">
        <div className="hero-copy">
          <span>بازار آنلاین افغانستان</span>
          <h1>بازارک</h1>
          <h2>همه چیز را در یکجا پیدا کنید!</h2>
          <p>بخرید، بفروشید و ارتباط بگیرید...</p>
        </div>
        <div className="hero-bag">🛍️</div>
      </section>

      <form className="search-area" onSubmit={handleSearch}>
        <select
          aria-label="انتخاب ولایت"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">همه ولایت‌ها</option>
          <option value="هرات">هرات</option>
          <option value="کابل">کابل</option>
          <option value="قندهار">قندهار</option>
          <option value="بلخ">بلخ</option>
          <option value="ننگرهار">ننگرهار</option>
          <option value="غزنی">غزنی</option>
          <option value="فراه">فراه</option>
          <option value="بامیان">بامیان</option>
        </select>

        <select
          aria-label="انتخاب دسته‌بندی"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">همه دسته‌بندی‌ها</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name_fa}
            </option>
          ))}
        </select>

        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="چه چیزی را جستجو می‌کنید؟"
        />

        <button type="submit" disabled={loading}>
          {loading ? "در حال جستجو..." : "جستجو 🔍"}
        </button>

        <button type="button" onClick={clearSearch}>
          پاک کردن فیلترها
        </button>
      </form>

      <section className="categories" id="categories">
        <div className="section-heading">
          <h2>دسته‌بندی آگهی‌ها</h2>
          <span>همه دسته‌ها</span>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <button
              className="category-card"
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(String(cat.id));
                loadAds(searchText, selectedCity, String(cat.id));
              }}
              style={{ cursor: "pointer" }}
            >
              <span>📁</span>
              <strong>{cat.name_fa}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="market-content" id="ads">
        <aside className="popular">
          <h3>🔥 دسته‌بندی‌های پرطرفدار</h3>

          {categories.slice(0, 8).map((cat) => (
            <button
              className="popular-item"
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(String(cat.id));
                loadAds(searchText, selectedCity, String(cat.id));
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "right",
                border: 0,
                background: "transparent",
                cursor: "pointer",
              }}
            >
              📁 {cat.name_fa}
            </button>
          ))}
        </aside>

        <div className="featured">
          <div className="section-heading">
            <h2>⭐ آگهی‌های بازارک</h2>
            <span>تعداد: {ads.length}</span>
          </div>

          {loading && <p>در حال دریافت آگهی‌ها...</p>}

          {!loading && ads.length === 0 && (
            <p>آگهی‌ای با این مشخصات پیدا نشد.</p>
          )}

          <div className="ads-grid">
            {ads.map((item) => (
              <Link
                href={`/listing/${item.id}`}
                className="ad-card"
                key={item.id}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div className="ad-image">
                  {images[item.id] ? (
                    <img
                      src={images[item.id]}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "📦"
                  )}
                </div>

                <div className="ad-info">
                  <strong>{item.title}</strong>

                  <b>
                    {item.price
                      ? Number(item.price).toLocaleString() + " افغانی"
                      : "قیمت توافقی"}
                  </b>

                  <small>📍 {item.city}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="trust">
        <div>👥<strong>بازار آنلاین افغانستان</strong></div>
        <div>⚡<strong>استفاده آسان</strong></div>
        <div>🛡️<strong>نظارت بر آگهی‌ها</strong></div>
        <div>🎧<strong>پشتیبانی کاربران</strong></div>
      </section>

      <footer>
        <h2>بازارک | Bazaarak</h2>
        <p>خرید و فروش آسان در سراسر افغانستان</p>
        <p>تمام حقوق محفوظ است © بازارک</p>
      </footer>
    </main>
  );
}
