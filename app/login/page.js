
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkUserStatus(userId) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role, is_blocked")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      await supabase.auth.signOut();
      throw new Error("بررسی وضعیت حساب انجام نشد. لطفاً دوباره تلاش کنید.");
    }

    if (profile.is_blocked) {
      await supabase.auth.signOut();
      throw new Error("حساب کاربری شما توسط مدیریت بازارک مسدود شده است.");
    }

    return profile;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (method === "phone") {
        throw new Error("ورود با شماره موبایل به‌زودی فعال می‌شود.");
      }

      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.session && data.user) {
          await checkUserStatus(data.user.id);
          router.push("/");
        } else {
          setMessage("ثبت‌نام انجام شد. اکنون می‌توانید وارد حساب خود شوید.");
          setIsRegister(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        await checkUserStatus(data.user.id);
        router.push("/");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#f4f7f4",
      padding: "20px"
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: "400px",
        background: "white",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px #0001"
      }}>
        <h1 style={{ color: "#16834a", textAlign: "center" }}>
          بازارک
        </h1>

        <h2 style={{ textAlign: "center", fontSize: "21px" }}>
          {isRegister ? "ساخت حساب کاربری" : "ورود به حساب کاربری"}
        </h2>

        <div style={{
          display: "flex",
          gap: "8px",
          margin: "20px 0"
        }}>
          <button
            type="button"
            onClick={() => {
              setMethod("email");
              setMessage("");
            }}
            style={{
              ...tabStyle,
              background: method === "email" ? "#16834a" : "#eee",
              color: method === "email" ? "white" : "#333"
            }}
          >
            ایمیل
          </button>

          <button
            type="button"
            onClick={() => {
              setMethod("phone");
              setMessage("ورود با شماره موبایل به‌زودی فعال می‌شود.");
            }}
            style={{
              ...tabStyle,
              background: method === "phone" ? "#16834a" : "#eee",
              color: method === "phone" ? "white" : "#333"
            }}
          >
            شماره موبایل
          </button>
        </div>

        {method === "email" && (
          <>
            <label>ایمیل</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل خود را وارد کنید"
              style={inputStyle}
            />

            <label>رمز عبور</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="حداقل ۶ حرف یا عدد"
              style={inputStyle}
            />

            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading
                ? "لطفاً صبر کنید..."
                : isRegister
                ? "ثبت‌نام"
                : "ورود"}
            </button>
          </>
        )}

        {method === "phone" && (
          <p style={{
            textAlign: "center",
            color: "#777",
            lineHeight: 2,
            padding: "12px"
          }}>
            ورود و ثبت‌نام با شماره موبایل به‌زودی در بازارک فعال می‌شود.
          </p>
        )}

        {message && (
          <p style={{
            textAlign: "center",
            color: "#b42318",
            lineHeight: 1.8
          }}>
            {message}
          </p>
        )}

        {method === "email" && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            {isRegister ? "قبلاً حساب ساخته‌اید؟" : "حساب کاربری ندارید؟"}

            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage("");
              }}
              style={{
                border: "none",
                background: "none",
                color: "#16834a",
                cursor: "pointer",
                fontWeight: "bold",
                marginRight: "6px"
              }}
            >
              {isRegister ? "ورود" : "ثبت‌نام کنید"}
            </button>
          </p>
        )}
      </form>
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  margin: "8px 0 18px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxSizing: "border-box",
  fontSize: "15px"
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  background: "#16834a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer"
};

const tabStyle = {
  flex: 1,
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  fontSize: "15px",
  cursor: "pointer"
};
