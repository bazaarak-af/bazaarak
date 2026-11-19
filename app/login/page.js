
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          router.push("/");
        } else {
          setMessage("ثبت‌نام انجام شد. ایمیل خود را برای تأیید بررسی کنید.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

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
          {loading ? "لطفاً صبر کنید..." : isRegister ? "ثبت‌نام" : "ورود"}
        </button>

        {message && (
          <p style={{ textAlign: "center", color: "#b42318" }}>
            {message}
          </p>
        )}

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
