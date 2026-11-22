
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

const translations = {
  fa: {
    brand: "بازارک",
    tagline: "بازار آنلاین افغانستان",
    home: "صفحه اصلی",
    categories: "دسته‌بندی‌ها",
    ads: "آگهی‌ها",
    login: "ورود / ثبت‌نام",
    post: "＋ ثبت آگهی رایگان",
    heroTitle: "همه چیز را در یکجا پیدا کنید!",
    heroText: "بخرید، بفروشید و آسان ارتباط بگیرید",
    searchPlaceholder: "چه چیزی را جستجو می‌کنید؟",
    allCities: "همه ولایت‌ها",
    allCategories: "همه دسته‌بندی‌ها",
    search: "جستجو",
    clear: "پاک کردن فیلترها",
    categoryTitle: "دسته‌بندی آگهی‌ها",
    popular: "دسته‌بندی‌های پرطرفدار",
    latest: "آگهی‌های بازارک",
    count: "تعداد",
    loading: "در حال دریافت آگهی‌ها...",
    searching: "در حال جستجو...",
    empty: "آگهی‌ای با این مشخصات پیدا نشد.",
    negotiable: "قیمت توافقی",
    trust1: "بازار آنلاین افغانستان",
    trust2: "استفاده آسان",
    trust3: "نظارت بر آگهی‌ها",
    trust4: "ارتباط مستقیم",
    footer: "خرید و فروش آسان در سراسر افغانستان",
    rights: "تمام حقوق محفوظ است © بازارک",
    all: "همه دسته‌ها"
  },
  ps: {
    brand: "بازارک",
    tagline: "د افغانستان آنلاین بازار",
    home: "کورپاڼه",
    categories: "کټګورۍ",
    ads: "اعلانونه",
    login: "ننوتل / نوملیکنه",
    post: "＋ وړیا اعلان خپور کړئ",
    heroTitle: "هر څه په یوه ځای کې ومومئ!",
    heroText: "واخلئ، وپلورئ او په اسانۍ اړیکه ونیسئ",
    searchPlaceholder: "څه شی لټوئ؟",
    allCities: "ټول ولایتونه",
    allCategories: "ټولې کټګورۍ",
    search: "لټون",
    clear: "فلټرونه پاک کړئ",
    categoryTitle: "د اعلانونو کټګورۍ",
    popular: "مشهورې کټګورۍ",
    latest: "د بازارک اعلانونه",
    count: "شمېر",
    loading: "اعلانونه ترلاسه کېږي...",
    searching: "لټون روان دی...",
    empty: "په دې مشخصاتو کوم اعلان ونه موندل شو.",
    negotiable: "توافقي بیه",
    trust1: "د افغانستان آنلاین بازار",
    trust2: "اسانه کارونه",
    trust3: "د اعلانونو څارنه",
    trust4: "مستقیمه اړیکه",
    footer: "په ټول افغانستان کې اسانه پېر او پلور",
    rights: "ټول حقوق خوندي دي © بازارک",
    all: "ټولې کټګورۍ"
  },
  en: {
    brand: "Bazaarak",
    tagline: "Afghanistan Online Marketplace",
    home: "Home",
    categories: "Categories",
    ads: "Listings",
    login: "Login / Sign up",
    post: "＋ Post a free ad",
    heroTitle: "Find everything in one place!",
    heroText: "Buy, sell and connect easily",
    searchPlaceholder: "What are you looking for?",
    allCities: "All provinces",
    allCategories: "All categories",
    search: "Search",
    clear: "Clear filters",
    categoryTitle: "Browse Categories",
    popular: "Popular Categories",
    latest: "Bazaarak Listings",
    count: "Total",
    loading: "Loading listings...",
    searching: "Searching...",
    empty: "No listings found.",
    negotiable: "Negotiable",
    trust1: "Afghanistan Marketplace",
    trust2: "Easy to use",
    trust3: "Moderated listings",
    trust4: "Direct contact",
    footer: "Easy buying and selling across Afghanistan",
    rights: "All rights reserved © Bazaarak",
    all: "All categories"
  }
};

const provinces = [
  { value: "هرات", fa: "هرات", ps: "هرات", en: "Herat" },
  { value: "کابل", fa: "کابل", ps: "کابل", en: "Kabul" },
  { value: "قندهار", fa: "قندهار", ps: "کندهار", en: "Kandahar" },
  { value: "بلخ", fa: "بلخ", ps: "بلخ", en: "Balkh" },
  { value: "ننگرهار", fa: "ننگرهار", ps: "ننګرهار", en: "Nangarhar" },
  { value: "غزنی", fa: "غزنی", ps: "غزني", en: "Ghazni" },
  { value: "فراه", fa: "فراه", ps: "فراه", en: "Farah" },
  { value: "بامیان", fa: "بامیان", ps: "بامیان", en: "Bamyan" }
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [ads, setAds] = useState([]);
  const [images, setImages] = useState({});
  const [searchText, setSearchText] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("fa");
useEffect(() => {
  const savedLanguage = localStorage.getItem("bazaarak-language");
  if (savedLanguage && translations[savedLanguage]) {
    setLang(savedLanguage);
  }
}, []);
  const t = translations[lang];
  const direction = lang === "en" ? "ltr" : "rtl";

  function categoryName(cat) {
    if (lang === "ps") return cat.name_ps || cat.name_fa;
    if (lang === "en") return cat.name_en || cat.name_fa;
    return cat.name_fa;
  }

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

    if (city) query = query.eq("city", city);
    if (category) query = query.eq("category_id", Number(category));

    const { data, error } = await query;

    if (error) {
      console.error("خطا در دریافت آگهی‌ها:", error);
      setLoading(false);
      return;
    }

    const items = data || [];
    setAds(items);

    if (!items.length) {
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
    async function initialize() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("id");

      if (error) {
        console.error("خطا در دریافت دسته‌بندی‌ها:", error);
      } else {
        setCategories(data || []);
      }

      loadAds();
    }

    initialize();
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

  function chooseCategory(id) {
    const value = String(id);
    setSelectedCategory(value);
    loadAds(searchText, selectedCity, value);
  }

  return (
    <main
      dir={direction}
      style={{
        minHeight: "100vh",
        background: "#f5f8f6",
        color: "#18352a",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <header className="bazaar-header">
  <div
      

<header className="bazaar-header">
  <div
    className="bazaar-hero-header"
    style={{
      backgroundImage:
        "linear-gradient(rgba(0,35,20,0.25), rgba(0,35,20,0.35)), url('/banners/file_000000000ae08211a11b06bdd61091c2.png')"
    }}
  >
    <div className="bazaar-brand">
      <strong>
        {lang === "ps"
          ? "د افغانستان د پېر او پلور بازار"
          : lang === "en"
          ? "Afghanistan Buy & Sell Marketplace"
          : "بازار خرید و فروش افغانستان"}
      </strong>
      <span>
        {lang === "ps"
          ? "اسانه پېرود، ډاډمن پلور"
          : lang === "en"
          ? "Easy Buying, Trusted Selling"
          : "خرید آسان، فروش مطمئن"}
      </span>
    </div>
  </div>

  <div className="bazaar-header-actions">
    <select
      value={lang}
      onChange={(e) => {
        const value = e.target.value;
        setLang(value);
        localStorage.setItem("bazaarak-language", value);
      }}
      className="bazaar-language"
    >
      <option value="fa">فارسی</option>
      <option value="ps">پښتو</option>
      <option value="en">English</option>
    </select>

    <Link href="/login" className="bazaar-login">
      {t.login}
    </Link>

    <Link href="/new-ad" className="bazaar-post">
      + {t.post}
    </Link>
  </div>

  <nav className="bazaar-nav">
    <Link href="/">{t.home}</Link>
    <a href="#categories">{t.categories}</a>
    <a href="#ads">{t.ads}</a>
  </nav>
</header>

      <form
  onSubmit={handleSearch}
  style={{
    width: "90%",
    maxWidth: 1100,
    margin: "0 auto 35px",
    padding: 18,
    background: "#fff",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    boxShadow: "0 8px 30px #12332212",
    border: "1px solid #edf1ee",
    boxSizing: "border-box"
  }}
>
  <select
    value={selectedCity}
    onChange={(e) => setSelectedCity(e.target.value)}
    style={{
      ...fieldStyle,
      flex: "1 1 190px",
      minWidth: 0,
      boxSizing: "border-box"
    }}
    aria-label={t.allCities}
  >
    <option value="">{t.allCities}</option>
    {provinces.map((p) => (
      <option key={p.value} value={p.value}>
        {p[lang]}
      </option>
    ))}
  </select>

  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    style={{
      ...fieldStyle,
      flex: "1 1 190px",
      minWidth: 0,
      boxSizing: "border-box"
    }}
    aria-label={t.allCategories}
  >
    <option value="">{t.allCategories}</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {categoryName(cat)}
      </option>
    ))}
  </select>

  <input
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    placeholder={t.searchPlaceholder}
    style={{
      ...fieldStyle,
      flex: "2 1 240px",
      minWidth: 0,
      boxSizing: "border-box"
    }}
  />

  <button
    type="submit"
    disabled={loading}
    style={{
      ...searchButton,
      flex: "1 1 135px",
      minWidth: 0
    }}
  >
    {loading ? t.searching : `🔍 ${t.search}`}
  </button>

  <button
    type="button"
    onClick={clearSearch}
    style={{
      ...clearButton,
      flex: "1 1 135px",
      minWidth: 0
    }}
  >
    {t.clear}
  </button>
</form>

     <section
  id="categories"
  style={{
    width: "90%",
    maxWidth: 1200,
    margin: "45px auto"
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 22
    }}
  >
    <h2 style={{ ...headingStyle, margin: 0 }}>
      📂 {t.categoryTitle}
    </h2>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
      gap: 16
    }}
  >
    {categories.map((cat) => {
      const categoryImages = {
        "املاک": "/categories/real-estate.jpg",
        "وسایل نقلیه": "/categories/vehicles.jpg",
        "لوازم الکترونیکی": "/categories/electronics.jpg",
        "خانه و آشپزخانه": "/categories/home-kitchen.jpg",
        "کشاورزی": "/categories/agriculture.jpg",
        "دام و طیور": "/categories/livestock-poultry.jpg",
        "استخدام و کاریابی": "/categories/jobs.jpg",
        "خدمات": "/categories/services.jpg",
        "پوشاک": "/categories/clothing.jpg"
      };

      return (
        <button
          key={cat.id}
          type="button"
          onClick={() => chooseCategory(cat.id)}
          style={{
            border: "1px solid #e8eee9",
            background: "#fff",
            borderRadius: 18,
            padding: 8,
            overflow: "hidden",
            cursor: "pointer",
            color: "#24533d",
            boxShadow: "0 5px 18px rgba(18,51,34,0.08)",
            textAlign: "center",
            transition: "transform 0.2s ease"
          }}
        >
          <img
            src={categoryImages[cat.name_fa] || "/categories/real-estate.jpg"}
            alt={categoryName(cat)}
            style={{
              width: "100%",
              height: 125,
              objectFit: "cover",
              display: "block",
              borderRadius: 13
            }}
          />

          <div
            style={{
              padding: "14px 5px 9px",
              fontWeight: 800,
              fontSize: 15,
              color: "#174b35"
            }}
          >
            {categoryName(cat)}
          </div>
        </button>
      );
    })}
  </div>
</section> 

      <section
        id="ads"
        style={{
          width: "90%",
          maxWidth: 1200,
          margin: "45px auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: 20
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 18
            }}
          >
            <h2 style={headingStyle}>⭐ {t.latest}</h2>
            <span
              style={{
                background: "#e2f4e9",
                color: "#087c4b",
                padding: "8px 15px",
                borderRadius: 30,
                fontWeight: 700
              }}
            >
              {t.count}: {ads.length}
            </span>
          </div>

          {loading && <p>{t.loading}</p>}

          {!loading && ads.length === 0 && (
            <p
              style={{
                background: "#fff",
                padding: 25,
                borderRadius: 15,
                textAlign: "center"
              }}
            >
              {t.empty}
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 18
            }}
          >
            {ads.map((item) => (
              <Link
                href={`/listing/${item.id}`}
                key={item.id}
                style={{
                  background: "#fff",
                  borderRadius: 17,
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid #e8eee9",
                  boxShadow: "0 5px 18px #1233220b"
                }}
              >
                <div
                  style={{
                    height: 180,
                    background: "#edf3ef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                  }}
                >
                  {images[item.id] ? (
                    <img
                      src={images[item.id]}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 55 }}>📦</span>
                  )}
                </div>

                <div style={{ padding: 15 }}>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 16,
                      marginBottom: 12
                    }}
                  >
                    {item.title}
                  </strong>

                  <b style={{ color: "#07804c", fontSize: 17 }}>
                    {item.price
                      ? Number(item.price).toLocaleString(
                          lang === "en" ? "en-US" : lang === "ps" ? "ps-AF" : "fa-AF"
                        ) + (lang === "en" ? " AFN" : " افغانی")
                      : t.negotiable}
                  </b>

                  <div
                    style={{
                      color: "#718078",
                      marginTop: 12,
                      fontSize: 13
                    }}
                  >
                    📍 {item.city}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          background: "#e8f5ed",
          padding: "28px 5%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 20,
          textAlign: "center"
        }}
      >
        <div>👥 <strong>{t.trust1}</strong></div>
        <div>⚡ <strong>{t.trust2}</strong></div>
        <div>🛡️ <strong>{t.trust3}</strong></div>
        <div>🤝 <strong>{t.trust4}</strong></div>
      </section>

      <footer
        style={{
          background: "#123d2c",
          color: "#fff",
          padding: "35px 15px",
          textAlign: "center"
        }}
      >
        <h2>🛍️ {t.brand} | Bazaarak</h2>
        <p>{t.footer}</p>
        <p style={{ opacity: 0.7, fontSize: 13 }}>{t.rights}</p>
      </footer>
    </main>
  );
}

const navStyle = {
  color: "#365548",
  textDecoration: "none",
  fontWeight: 600
};

const languageStyle = {
  border: "1px solid #dce8df",
  borderRadius: 9,
  padding: "9px 10px",
  background: "#fff",
  color: "#18352a"
};

const loginStyle = {
  textDecoration: "none",
  color: "#087c4b",
  border: "1px solid #087c4b",
  padding: "10px 13px",
  borderRadius: 9,
  fontWeight: 700
};

const postStyle = {
  textDecoration: "none",
  color: "#fff",
  background: "#07804c",
  padding: "10px 14px",
  borderRadius: 9,
  fontWeight: 700
};

const fieldStyle = {
  flex: "1 1 150px",
  minWidth: 0,
  padding: 13,
  border: "1px solid #dce8df",
  borderRadius: 10,
  background: "#fff",
  color: "#18352a",
  fontSize: 14
};

const searchButton = {
  border: 0,
  borderRadius: 10,
  padding: "12px 22px",
  background: "#07804c",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer"
};

const clearButton = {
  border: "1px solid #dce8df",
  borderRadius: 10,
  padding: "12px 15px",
  background: "#f5f8f6",
  color: "#365548",
  cursor: "pointer"
};

const headingStyle = {
  fontSize: 22,
  color: "#183d2d",
  marginBottom: 20
};

const categoryCard = {
  border: "1px solid #e5eee8",
  background: "#fff",
  borderRadius: 15,
  padding: "22px 10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 12,
  color: "#24533d",
  cursor: "pointer",
  minHeight: 115
};
