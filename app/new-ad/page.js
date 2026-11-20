
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const translations = {
  fa: {
    title: "ثبت آگهی رایگان",
    subtitle: "محصول یا خدمات خود را در بازارک معرفی کنید",
    category: "دسته‌بندی آگهی",
    chooseCategory: "انتخاب دسته‌بندی",
    adTitle: "عنوان آگهی",
    titlePlaceholder: "مثلاً فروش موتر تویوتا",
    description: "توضیحات آگهی",
    descriptionPlaceholder: "مشخصات و توضیحات کالا یا خدمات را بنویسید...",
    price: "قیمت",
    currency: "افغانی",
    pricePlaceholder: "قیمت را وارد کنید",
    city: "ولایت / شهر",
    cityPlaceholder: "مثلاً هرات",
    phone: "شماره تماس",
    phonePlaceholder: "شماره تماس خود را وارد کنید",
    whatsapp: "شماره واتساپ",
    optional: "اختیاری",
    whatsappPlaceholder: "شماره واتساپ",
    photos: "عکس‌های آگهی",
    photoHint: "حداکثر ۵ عکس، هر عکس حداکثر ۵ مگابایت",
    selected: "عکس انتخاب شده",
    selectedPlural: "عکس انتخاب شده",
    submit: "ثبت آگهی",
    submitting: "در حال ثبت آگهی و آپلود عکس‌ها...",
    success: "آگهی و عکس‌های شما با موفقیت ثبت شد. پس از تأیید مدیر منتشر می‌شود.",
    login: "ابتدا وارد حساب کاربری شوید.",
    blocked: "حساب شما مسدود شده است و امکان ثبت آگهی ندارید.",
    categoryError: "دریافت دسته‌بندی‌ها با مشکل روبه‌رو شد.",
    maxPhotos: "حداکثر می‌توانید ۵ عکس انتخاب کنید.",
    invalidPhoto: "فقط عکس با حجم حداکثر ۵ مگابایت انتخاب کنید.",
    photoUploadError: "آگهی ثبت شد، اما آپلود عکس ناموفق بود: ",
    photoSaveError: "آگهی ثبت شد، اما ثبت اطلاعات عکس‌ها ناموفق بود: ",
    generalError: "ثبت آگهی با مشکل روبه‌رو شد.",
    language: "زبان",
    back: "بازگشت به صفحه اصلی",
    required: "این بخش الزامی است",
    photoCount: "از ۵ عکس"
  },
  ps: {
    title: "وړیا اعلان ثبت کړئ",
    subtitle: "خپل توکي او خدمتونه په بازارک کې معرفي کړئ",
    category: "د اعلان کټګوري",
    chooseCategory: "کټګوري وټاکئ",
    adTitle: "د اعلان سرلیک",
    titlePlaceholder: "لکه د ټویوټا موټر پلورل",
    description: "د اعلان توضیحات",
    descriptionPlaceholder: "د توکي یا خدمت ځانګړتیاوې ولیکئ...",
    price: "بیه",
    currency: "افغانۍ",
    pricePlaceholder: "بیه ولیکئ",
    city: "ولایت / ښار",
    cityPlaceholder: "لکه هرات",
    phone: "د اړیکې شمېره",
    phonePlaceholder: "خپله د اړیکې شمېره ولیکئ",
    whatsapp: "د واټساپ شمېره",
    optional: "اختیاري",
    whatsappPlaceholder: "د واټساپ شمېره",
    photos: "د اعلان انځورونه",
    photoHint: "تر ۵ انځورونو پورې، هر یو تر ۵ مېګابایټه",
    selected: "انځور غوره شوی",
    selectedPlural: "انځورونه غوره شوي",
    submit: "اعلان ثبت کړئ",
    submitting: "اعلان او انځورونه ثبتېږي...",
    success: "ستاسو اعلان او انځورونه ثبت شول. د مدیر له تایید وروسته به خپاره شي.",
    login: "لومړی خپل حساب ته ننوځئ.",
    blocked: "ستاسو حساب بند دی او اعلان نشئ ثبتولی.",
    categoryError: "د کټګوریو په ترلاسه کولو کې ستونزه رامنځته شوه.",
    maxPhotos: "تر ۵ انځورونو زیات نشئ غوره کولی.",
    invalidPhoto: "یوازې تر ۵ مېګابایټه پورې انځورونه غوره کړئ.",
    photoUploadError: "اعلان ثبت شو، خو د انځور پورته کول ناکام شول: ",
    photoSaveError: "اعلان ثبت شو، خو د انځورونو معلومات ثبت نه شول: ",
    generalError: "د اعلان په ثبتولو کې ستونزه رامنځته شوه.",
    language: "ژبه",
    back: "بېرته اصلي پاڼې ته",
    required: "دا برخه اړینه ده",
    photoCount: "له ۵ انځورونو څخه"
  },
  en: {
    title: "Post a Free Ad",
    subtitle: "Promote your products and services on Bazaarak",
    category: "Ad Category",
    chooseCategory: "Choose a category",
    adTitle: "Ad Title",
    titlePlaceholder: "e.g. Toyota car for sale",
    description: "Ad Description",
    descriptionPlaceholder: "Describe the product or service...",
    price: "Price",
    currency: "AFN",
    pricePlaceholder: "Enter the price",
    city: "Province / City",
    cityPlaceholder: "e.g. Herat",
    phone: "Phone Number",
    phonePlaceholder: "Enter your phone number",
    whatsapp: "WhatsApp Number",
    optional: "Optional",
    whatsappPlaceholder: "WhatsApp number",
    photos: "Ad Photos",
    photoHint: "Up to 5 photos, maximum 5 MB each",
    selected: "photo selected",
    selectedPlural: "photos selected",
    submit: "Post Ad",
    submitting: "Submitting ad and uploading photos...",
    success: "Your ad and photos were submitted successfully. They will be published after admin approval.",
    login: "Please log in first.",
    blocked: "Your account is blocked. You cannot post ads.",
    categoryError: "Could not load categories.",
    maxPhotos: "You can select a maximum of 5 photos.",
    invalidPhoto: "Only image files up to 5 MB are allowed.",
    photoUploadError: "Ad submitted, but photo upload failed: ",
    photoSaveError: "Ad submitted, but saving photo information failed: ",
    generalError: "Something went wrong while submitting the ad.",
    language: "Language",
    back: "Back to Home",
    required: "This field is required",
    photoCount: "of 5 photos"
  }
};

export default function NewAdPage() {
  const router = useRouter();

  const [lang, setLang] = useState("fa");
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [form, setForm] = useState({
    category_id: "",
    title: "",
    description: "",
    price: "",
    city: "هرات",
    phone: "",
    whatsapp: "",
  });

  const t = translations[lang];
  const isRTL = lang !== "en";

  useEffect(() => {
    const saved = localStorage.getItem("bazaarak-language");
    if (saved && translations[saved]) setLang(saved);
  }, []);

  function changeLanguage(value) {
    setLang(value);
    localStorage.setItem("bazaarak-language", value);
  }

  useEffect(() => {
    async function loadPage() {
      try {
        const { data: authData } = await supabase.auth.getUser();

        if (!authData.user) {
          router.push("/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_blocked")
          .eq("id", authData.user.id)
          .single();

        if (profileError || !profile || profile.is_blocked) {
          await supabase.auth.signOut();
          router.push("/login");
          return;
        }

        setUser(authData.user);

        const { data, error } = await supabase
          .from("categories")
          .select("id, name_fa, name_ps, name_en")
          .order("id");

        if (error) throw error;

        setCategories(data || []);
      } catch (error) {
        setMessage(error.message || t.categoryError);
        setMessageType("error");
      } finally {
        setPageLoading(false);
      }
    }

    loadPage();
  }, [router]);

  useEffect(() => {
    const urls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
      setMessage(t.maxPhotos);
      setMessageType("error");
      setSelectedFiles([]);
      setFileInputKey((key) => key + 1);
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !file.type.startsWith("image/") ||
        file.size > 5 * 1024 * 1024
    );

    if (invalidFile) {
      setMessage(t.invalidPhoto);
      setMessageType("error");
      setSelectedFiles([]);
      setFileInputKey((key) => key + 1);
      return;
    }

    setMessage("");
    setMessageType("");
    setSelectedFiles(files);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      setMessage(t.login);
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_blocked")
        .eq("id", user.id)
        .single();

      if (profileError || !profile || profile.is_blocked) {
        await supabase.auth.signOut();
        setUser(null);
        setMessage(t.blocked);
        setMessageType("error");
        router.push("/login");
        return;
      }

      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .insert({
          user_id: user.id,
          category_id: Number(form.category_id),
          title: form.title.trim(),
          description: form.description.trim(),
          price: form.price ? Number(form.price) : null,
          city: form.city.trim(),
          phone: form.phone.trim(),
          whatsapp: form.whatsapp.trim() || null,
          status: "pending",
        })
        .select("id")
        .single();

      if (listingError) throw listingError;

      const imageRecords = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath =
          `${user.id}/${listing.id}/${Date.now()}-${i}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(t.photoUploadError + uploadError.message);
        }

        const { data: publicData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(filePath);

        imageRecords.push({
          listing_id: listing.id,
          image_url: publicData.publicUrl,
        });
      }

      if (imageRecords.length > 0) {
        const { error: imageError } = await supabase
          .from("listing_images")
          .insert(imageRecords);

        if (imageError) {
          throw new Error(t.photoSaveError + imageError.message);
        }
      }

      setMessage(t.success);
      setMessageType("success");

      setForm({
        category_id: "",
        title: "",
        description: "",
        price: "",
        city: "هرات",
        phone: "",
        whatsapp: "",
      });

      setSelectedFiles([]);
      setFileInputKey((key) => key + 1);

    } catch (error) {
      setMessage(error.message || t.generalError);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #dce5df",
    borderRadius: "10px",
    boxSizing: "border-box",
    fontSize: "15px",
    background: "#fff",
    outline: "none",
    marginTop: "8px",
    color: "#26352c",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#263c30",
    marginTop: "18px",
  };

  function categoryName(cat) {
    if (lang === "ps") return cat.name_ps || cat.name_fa;
    if (lang === "en") return cat.name_en || cat.name_fa;
    return cat.name_fa;
  }

  if (pageLoading) {
    return (
      <main style={{ padding: 50, textAlign: "center", color: "#16834a" }}>
        در حال آماده‌سازی صفحه...
      </main>
    );
  }

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        minHeight: "100vh",
        background: "#f3f7f4",
        padding: "25px 14px 50px",
        fontFamily: "inherit",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <a href="/" style={{
            color: "#16834a",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "14px",
          }}>
            ← {t.back}
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#607568" }}>
              {t.language}
            </span>
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #dce5df",
                background: "white",
                color: "#26352c",
              }}
            >
              <option value="fa">فارسی</option>
              <option value="ps">پښتو</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div style={{
          background: "white",
          borderRadius: "18px",
          padding: "25px",
          boxShadow: "0 8px 30px rgba(25,70,42,0.07)",
          border: "1px solid #e6eee8",
        }}>

          <div style={{
            textAlign: "center",
            marginBottom: "25px",
          }}>
            <div style={{
              width: "58px",
              height: "58px",
              borderRadius: "16px",
              background: "#e6f5eb",
              color: "#16834a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              margin: "0 auto 12px",
            }}>
              +
            </div>

            <h1 style={{
              color: "#16834a",
              fontSize: "25px",
              margin: "0 0 8px",
            }}>
              {t.title}
            </h1>

            <p style={{
              color: "#78877d",
              fontSize: "14px",
              margin: 0,
            }}>
              {t.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <label style={labelStyle}>{t.category}</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">{t.chooseCategory}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {categoryName(cat)}
                </option>
              ))}
            </select>

            <label style={labelStyle}>{t.adTitle}</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder={t.titlePlaceholder}
              required
              maxLength={100}
              style={inputStyle}
            />

            <label style={labelStyle}>{t.description}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={t.descriptionPlaceholder}
              required
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
            />

            <label style={labelStyle}>
              {t.price} ({t.currency})
            </label>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder={t.pricePlaceholder}
              style={inputStyle}
            />

            <label style={labelStyle}>{t.city}</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder={t.cityPlaceholder}
              required
              style={inputStyle}
            />

            <label style={labelStyle}>{t.phone}</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder={t.phonePlaceholder}
              required
              style={inputStyle}
            />

            <label style={labelStyle}>
              {t.whatsapp}{" "}
              <span style={{ color: "#89978e", fontWeight: "400" }}>
                ({t.optional})
              </span>
            </label>
            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder={t.whatsappPlaceholder}
              style={inputStyle}
            />

            <label style={labelStyle}>{t.photos}</label>
            <div style={{
              border: "2px dashed #b8d8c3",
              background: "#f7fbf8",
              borderRadius: "12px",
              padding: "18px",
              marginTop: "8px",
            }}>
              <input
                key={fileInputKey}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ width: "100%", fontSize: "14px" }}
              />

              <p style={{
                color: "#78877d",
                fontSize: "12px",
                margin: "10px 0 0",
              }}>
                {t.photoHint}
              </p>

              {selectedFiles.length > 0 && (
                <>
                  <p style={{
                    color: "#16834a",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginTop: "15px",
                  }}>
                    {selectedFiles.length} {lang === "en" ? t.selectedPlural : t.selected}
                    {" "}({t.photoCount})
                  </p>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                    gap: "10px",
                  }}>
                    {previews.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Photo ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "90px",
                          objectFit: "cover",
                          borderRadius: "9px",
                          border: "1px solid #dce5df",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {message && (
              <div style={{
                marginTop: "18px",
                padding: "13px",
                borderRadius: "10px",
                fontSize: "14px",
                lineHeight: 1.8,
                color: messageType === "success" ? "#176b3a" : "#a52d2d",
                background: messageType === "success" ? "#e9f7ed" : "#fff0f0",
                border: `1px solid ${messageType === "success" ? "#c6e8cf" : "#f2cccc"}`,
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "22px",
                background: loading ? "#8ab99b" : "#16834a",
                color: "white",
                border: "none",
                borderRadius: "11px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? t.submitting : t.submit}
            </button>

            <p style={{
              textAlign: "center",
              color: "#89978e",
              fontSize: "12px",
              marginTop: "14px",
            }}>
              {t.success.includes("پس از تأیید")
                ? "آگهی شما پس از بررسی مدیر در بازارک نمایش داده می‌شود."
                : ""}
            </p>

          </form>
        </div>
      </div>
    </main>
  );
}
