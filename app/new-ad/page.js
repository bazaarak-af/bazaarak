
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function NewAdPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    category_id: "",
    title: "",
    description: "",
    price: "",
    city: "هرات",
    phone: "",
    whatsapp: "",
  });

  useEffect(() => {
    async function loadPage() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.push("/login");
        return;
      }

      setUser(authData.user);

      const { data, error } = await supabase
        .from("categories")
        .select("id, name_fa")
        .order("id");

      if (error) {
        setMessage("دریافت دسته‌بندی‌ها با مشکل روبه‌رو شد.");
        return;
      }

      setCategories(data || []);
    }

    loadPage();
  }, [router]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      setMessage("ابتدا وارد حساب کاربری شوید.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("listings").insert({
      user_id: user.id,
      category_id: Number(form.category_id),
      title: form.title,
      description: form.description,
      price: form.price ? Number(form.price) : null,
      city: form.city,
      phone: form.phone,
      whatsapp: form.whatsapp || null,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      setMessage("ثبت آگهی ناموفق بود: " + error.message);
      return;
    }

    setMessage("آگهی شما ثبت شد و پس از تأیید مدیر منتشر می‌شود.");

    setForm({
      category_id: "",
      title: "",
      description: "",
      price: "",
      city: "هرات",
      phone: "",
      whatsapp: "",
    });
  }

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "7px 0 18px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "15px",
  };

  return (
    <main dir="rtl" style={{
      maxWidth: "600px",
      margin: "30px auto",
      padding: "20px",
      background: "#f5f8f5",
      minHeight: "100vh",
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "white",
        padding: "25px",
        borderRadius: "14px",
      }}>
        <h1 style={{ color: "#16834a" }}>ثبت آگهی رایگان</h1>

        <label>دسته‌بندی آگهی</label>
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">انتخاب دسته‌بندی</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name_fa}
            </option>
          ))}
        </select>

        <label>عنوان آگهی</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="مثلاً فروش موتر تویوتا"
          required
          style={inputStyle}
        />

        <label>توضیحات آگهی</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="مشخصات و توضیحات کالا یا خدمات..."
          required
          rows={5}
          style={inputStyle}
        />

        <label>قیمت (افغانی)</label>
        <input
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={handleChange}
          placeholder="قیمت را وارد کنید"
          style={inputStyle}
        />

        <label>ولایت / شهر</label>
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>شماره تماس</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="شماره تماس"
          style={inputStyle}
        />

        <label>شماره واتساپ (اختیاری)</label>
        <input
          name="whatsapp"
          value={form.whatsapp}
          onChange={handleChange}
          placeholder="شماره واتساپ"
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: "#16834a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          {loading ? "در حال ثبت..." : "ثبت آگهی"}
        </button>

        {message && (
          <p style={{ marginTop: "18px", color: "#16834a" }}>
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
