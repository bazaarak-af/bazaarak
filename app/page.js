 
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
export default function Home() {

  const [categories, setCategories] = useState([]);
const [ads, setAds] = useState([]);
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

    if (data) {
      setCategories(
        data.map((item) => ["📁", item.name_fa])
      );
    }
  }

  async function loadAds() {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("خطا در دریافت آگهی‌ها:", error);
      return;
    }

    setAds(data || []);
  }

  loadCategories();
  loadAds();
}, []);
  return (
    <main className="site" dir="rtl">
      <header className="topbar">
        <div className="brand">🛍️ بازارک</div>
        <nav>
          <a href="#">صفحه اصلی</a>
          <a href="#categories">دسته‌بندی‌ها</a>
          <a href="#ads">آگهی‌ها</a>
          <a href="#">درباره ما</a>
          <a href="#">تماس با ما</a>
        </nav>
        <div className="header-actions">
          <button className="login">ورود / ثبت‌نام</button>
          <button className="post-ad">＋ ثبت آگهی رایگان</button>
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

      <section className="search-area">
        <select aria-label="انتخاب ولایت">
          <option>همه ولایت‌ها</option>
          <option>هرات</option>
          <option>کابل</option>
          <option>قندهار</option>
          <option>بلخ</option>
        </select>
        <input placeholder="چه چیزی را جستجو می‌کنید؟" />
        <button>جستجو 🔍</button>
      </section>

      <section className="categories" id="categories">
        <div className="section-heading">
          <h2>دسته‌بندی آگهی‌ها</h2>
          <span>همه دسته‌ها</span>
        </div>
        <div className="category-grid">
          {categories.map(([icon, name]) => (
            <a className="category-card" href="#" key={name}>
              <span>{icon}</span>
              <strong>{name}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="market-content" id="ads">
        <aside className="popular">
          <h3>🔥 دسته‌بندی‌های پرطرفدار</h3>
          {categories.slice(0, 8).map(([icon, name]) => (
            <div className="popular-item" key={name}>
              <span>{icon}</span> {name}
            </div>
          ))}
        </aside>

        <div className="featured">
          <div className="section-heading">
            <h2>⭐ آگهی‌های ویژه</h2>
            <a href="#">مشاهده همه ←</a>
          </div>
          <div className="ads-grid">
  {ads.map((item) => (
    <article className="ad-card" key={item.id}>
      <div className="ad-image">📦</div>

      <div className="ad-info">
        <strong>{item.title}</strong>

        <b>
          {item.price
            ? Number(item.price).toLocaleString() + " افغانی"
            : "قیمت توافقی"}
        </b>

        <small>📍 {item.city}</small>
      </div>
    </article>
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
