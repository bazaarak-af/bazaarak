
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState({});
  const [message, setMessage] = useState("");

  async function loadListings() {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("دریافت آگهی‌ها ناموفق بود: " + error.message);
      return;
    }

    const items = data || [];
    setListings(items);

    if (items.length === 0) {
      setImages({});
      return;
    }

    const ids = items.map((item) => item.id);

    const { data: imageData, error: imageError } = await supabase
      .from("listing_images")
      .select("id, listing_id, image_url")
      .in("listing_id", ids);

    if (imageError) {
      setMessage("دریافت عکس‌ها ناموفق بود: " + imageError.message);
      return;
    }

    const groupedImages = {};

    (imageData || []).forEach((img) => {
      if (!groupedImages[img.listing_id]) {
        groupedImages[img.listing_id] = [];
      }

      groupedImages[img.listing_id].push(img);
    });

    setImages(groupedImages);
  }

  useEffect(() => {
    async function checkAdmin() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.push("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (error || profile?.role !== "admin") {
        setMessage("شما اجازه دسترسی به پنل مدیریت را ندارید.");
        setChecking(false);
        return;
      }

      setAuthorized(true);

      const { data: categoryData } = await supabase
        .from("categories")
        .select("id, name_fa");

      setCategories(categoryData || []);
      await loadListings();
      setChecking(false);
    }

    checkAdmin();
  }, [router]);

  async function changeStatus(id, status) {
    setMessage("");

    const { error } = await supabase
      .from("listings")
      .update({ status })
      .eq("id", id);

    if (error) {
      setMessage("تغییر وضعیت انجام نشد: " + error.message);
      return;
    }

    setMessage(
      status === "approved"
        ? "آگهی با موفقیت تأیید شد."
        : "آگهی رد شد."
    );

    await loadListings();
  }

  if (checking) {
    return (
      <main style={{ padding: 30, direction: "rtl" }}>
        در حال بررسی دسترسی...
      </main>
    );
  }

  if (!authorized) {
    return (
      <main style={{ padding: 30, direction: "rtl" }}>
        {message}
      </main>
    );
  }

  return (
    <main style={{
      direction: "rtl",
      maxWidth: 900,
      margin: "30px auto",
      padding: 20,
      fontFamily: "Arial",
      color: "#222"
    }}>
      <h1 style={{ color: "#16834a" }}>پنل مدیریت بازارک</h1>
      <p>آگهی‌های منتظر تأیید مدیر</p>

      {message && (
        <p style={{
          background: "#eef8f0",
          padding: 12,
          borderRadius: 8
        }}>
          {message}
        </p>
      )}

      <p>تعداد آگهی‌های در انتظار: {listings.length}</p>

      {listings.length === 0 && (
        <p>در حال حاضر آگهی منتظر تأیید وجود ندارد.</p>
      )}

      {listings.map((item) => {
        const category = categories.find(
          (cat) => cat.id === item.category_id
        );

        const listingImages = images[item.id] || [];

        return (
          <section key={item.id} style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            background: "#fff"
          }}>
            <h3>{item.title}</h3>

            <p>دسته‌بندی: {category?.name_fa || "نامشخص"}</p>
            <p>توضیحات: {item.description}</p>
            <p>قیمت: {item.price ?? "توافقی"}</p>
            <p>شهر: {item.city}</p>
            <p>شماره تماس: {item.phone}</p>

            <h4>عکس‌های آگهی ({listingImages.length})</h4>

            {listingImages.length > 0 ? (
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 18
              }}>
                {listingImages.map((img) => (
                  <a
                    key={img.id}
                    href={img.image_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={img.image_url}
                      alt="عکس آگهی"
                      style={{
                        width: 140,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ddd"
                      }}
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p>برای این آگهی عکسی ثبت نشده است.</p>
            )}

            <div style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap"
            }}>
              <button
                onClick={() => changeStatus(item.id, "approved")}
                style={{
                  background: "#16834a",
                  color: "white",
                  border: 0,
                  padding: "10px 18px",
                  borderRadius: 8
                }}
              >
                تأیید و انتشار
              </button>

              <button
                onClick={() => changeStatus(item.id, "rejected")}
                style={{
                  background: "#c0392b",
                  color: "white",
                  border: 0,
                  padding: "10px 18px",
                  borderRadius: 8
                }}
              >
                رد آگهی
              </button>
            </div>
          </section>
        );
      })}
    </main>
  );
}
