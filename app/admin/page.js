
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [adminId, setAdminId] = useState("");

  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState({});
  const [users, setUsers] = useState([]);

  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("listings");
  const [loadingUsers, setLoadingUsers] = useState(false);

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

  async function loadUsers() {
    setLoadingUsers(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, role, is_blocked, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("دریافت کاربران ناموفق بود: " + error.message);
      setLoadingUsers(false);
      return;
    }

    setUsers(data || []);
    setLoadingUsers(false);
  }

  useEffect(() => {
    async function checkAdmin() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.push("/login");
        return;
      }

      setAdminId(authData.user.id);

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
      await loadUsers();

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

  async function toggleUserBlock(user) {
    if (user.id === adminId || user.role === "admin") {
      setMessage("امکان مسدودکردن حساب مدیر وجود ندارد.");
      return;
    }

    const action = user.is_blocked ? "فعال" : "مسدود";

    const confirmed = window.confirm(
      `آیا می‌خواهید حساب ${user.full_name || "این کاربر"} را ${action} کنید؟`
    );

    if (!confirmed) return;

    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({ is_blocked: !user.is_blocked })
      .eq("id", user.id);

    if (error) {
      setMessage("تغییر وضعیت کاربر ناموفق بود: " + error.message);
      return;
    }

    setMessage(
      user.is_blocked
        ? "حساب کاربر دوباره فعال شد."
        : "حساب کاربر مسدود شد."
    );

    await loadUsers();
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
      maxWidth: 1000,
      margin: "30px auto",
      padding: 20,
      fontFamily: "Arial",
      color: "#222"
    }}>
      <h1 style={{ color: "#16834a" }}>
        پنل مدیریت بازارک
      </h1>

      <div style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        margin: "20px 0"
      }}>
        <button
          onClick={() => setActiveTab("listings")}
          style={{
            background: activeTab === "listings" ? "#16834a" : "#eee",
            color: activeTab === "listings" ? "white" : "#222",
            border: 0,
            padding: "12px 20px",
            borderRadius: 8
          }}
        >
          مدیریت آگهی‌ها
        </button>

        <button
          onClick={() => {
            setActiveTab("users");
            loadUsers();
          }}
          style={{
            background: activeTab === "users" ? "#16834a" : "#eee",
            color: activeTab === "users" ? "white" : "#222",
            border: 0,
            padding: "12px 20px",
            borderRadius: 8
          }}
        >
          مدیریت کاربران
        </button>
      </div>

      {message && (
        <p style={{
          background: "#eef8f0",
          padding: 12,
          borderRadius: 8
        }}>
          {message}
        </p>
      )}

      {activeTab === "listings" && (
        <>
          <h2>آگهی‌های منتظر تأیید مدیر</h2>

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
        </>
      )}

      {activeTab === "users" && (
        <>
          <h2>مدیریت کاربران بازارک</h2>

          <p>تعداد کل کاربران: {users.length}</p>
          <p>
            کاربران مسدود:
            {" "}
            {users.filter((user) => user.is_blocked).length}
          </p>

          <button
            onClick={loadUsers}
            style={{
              background: "#16834a",
              color: "white",
              border: 0,
              padding: "10px 18px",
              borderRadius: 8,
              marginBottom: 15
            }}
          >
            تازه‌سازی فهرست
          </button>

          {loadingUsers && <p>در حال دریافت کاربران...</p>}

          {!loadingUsers && users.length === 0 && (
            <p>هنوز کاربری ثبت‌نام نکرده است.</p>
          )}

          {users.map((user) => (
            <section key={user.id} style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              background: "#fff"
            }}>
              <h3>{user.full_name || "بدون نام"}</h3>

              <p>شماره تماس: {user.phone || "ثبت نشده"}</p>

              <p>
                نوع حساب:
                {" "}
                {user.role === "admin" ? "مدیر" : "کاربر عادی"}
              </p>

              <p>
                تاریخ ثبت‌نام:
                {" "}
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("fa-AF")
                  : "نامشخص"}
              </p>

              <p>
                وضعیت حساب:
                {" "}
                <strong style={{
                  color: user.is_blocked ? "#c0392b" : "#16834a"
                }}>
                  {user.is_blocked ? "مسدود" : "فعال"}
                </strong>
              </p>

              {user.role !== "admin" && user.id !== adminId && (
                <button
                  onClick={() => toggleUserBlock(user)}
                  style={{
                    background: user.is_blocked ? "#16834a" : "#c0392b",
                    color: "white",
                    border: 0,
                    padding: "10px 18px",
                    borderRadius: 8
                  }}
                >
                  {user.is_blocked ? "فعال‌کردن حساب" : "مسدودکردن کاربر"}
                </button>
              )}
            </section>
          ))}
        </>
      )}
    </main>
  );
}
