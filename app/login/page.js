
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const translations = {
  fa: {
    title: "بازارک",
    register: "ساخت حساب کاربری",
    login: "ورود به حساب کاربری",
    email: "ایمیل",
    phone: "شماره موبایل",
    password: "رمز عبور",
    emailPlaceholder: "ایمیل خود را وارد کنید",
    passwordPlaceholder: "حداقل ۶ حرف یا عدد",
    wait: "لطفاً صبر کنید...",
    submitRegister: "ثبت‌نام",
    submitLogin: "ورود",
    phoneSoon: "ورود و ثبت‌نام با شماره موبایل به‌زودی فعال می‌شود.",
    haveAccount: "قبلاً حساب ساخته‌اید؟",
    noAccount: "حساب کاربری ندارید؟",
    switchLogin: "ورود",
    switchRegister: "ثبت‌نام کنید",
    phoneMessage: "ورود با شماره موبایل به‌زودی فعال می‌شود.",
    blocked: "حساب کاربری شما توسط مدیریت بازارک مسدود شده است.",
    checkError: "بررسی وضعیت حساب انجام نشد. لطفاً دوباره تلاش کنید.",
    signupSuccess: "ثبت‌نام انجام شد. اکنون می‌توانید وارد حساب خود شوید."
  },
  ps: {
    title: "بازارک",
    register: "نوی حساب جوړول",
    login: "خپل حساب ته ننوتل",
    email: "برېښنالیک",
    phone: "د موبایل شمېره",
    password: "پټنوم",
    emailPlaceholder: "خپل برېښنالیک ولیکئ",
    passwordPlaceholder: "لږ تر لږه ۶ توري یا شمېرې",
    wait: "مهرباني وکړئ انتظار وکړئ...",
    submitRegister: "نوملیکنه",
    submitLogin: "ننوتل",
    phoneSoon: "د موبایل له لارې ننوتل به ژر فعال شي.",
    haveAccount: "مخکې مو حساب جوړ کړی؟",
    noAccount: "حساب نه لرئ؟",
    switchLogin: "ننوتل",
    switchRegister: "نوملیکنه",
    phoneMessage: "د موبایل له لارې ننوتل به ژر فعال شي.",
    blocked: "ستاسو حساب د بازارک د مدیریت له خوا بند شوی دی.",
    checkError: "د حساب حالت ونه کتل شو. مهرباني وکړئ بیا هڅه وکړئ.",
    signupSuccess: "نوملیکنه وشوه. اوس خپل حساب ته ننوتلی شئ."
  },
  en: {
    title: "Bazaarak",
    register: "Create an Account",
    login: "Login to Your Account",
    email: "Email",
    phone: "Phone Number",
    password: "Password",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "At least 6 characters",
    wait: "Please wait...",
    submitRegister: "Sign Up",
    submitLogin: "Login",
    phoneSoon: "Phone login and registration will be available soon.",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    switchLogin: "Login",
    switchRegister: "Sign Up",
    phoneMessage: "Phone login will be available soon.",
    blocked: "Your Bazaarak account has been blocked by the administrator.",
    checkError: "Could not verify your account status. Please try again.",
    signupSuccess: "Registration successful. You can now log in."
  }
};

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [lang, setLang] = useState("fa");
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("bazaarak-language");

    if (savedLanguage && translations[savedLanguage]) {
      setLang(savedLanguage);
    }
  }, []);

  const t = translations[lang];
  const direction = lang === "en" ? "ltr" : "rtl";

  async function checkUserStatus(userId) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role, is_blocked")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      await supabase.auth.signOut();
      throw new Error(t.checkError);
    }

    if (profile.is_blocked) {
      await supabase.auth.signOut();
      throw new Error(t.blocked);
    }

    return profile;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (method === "phone") {
        throw new Error(t.phoneMessage);
      }

      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password
        });

        if (error) throw error;

        if (data.session && data.user) {
          await checkUserStatus(data.user.id);
          router.push("/");
        } else {
          setMessage(t.signupSuccess);
          setIsRegister(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
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
    <main
      dir={direction}
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f4f7f4",
        padding: "20px"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <select
          value={lang}
          onChange={(e) => {
            const value = e.target.value;
            setLang(value);
            localStorage.setItem("bazaarak-language", value);
            setMessage("");
          }}
          style={{ padding: "9px", borderRadius: "8px" }}
        >
          <option value="fa">فارسی</option>
          <option value="ps">پښتو</option>
          <option value="en">English</option>
        </select>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px #0001"
        }}
      >
        <h1 style={{ color: "#16834a", textAlign: "center" }}>
          {t.title}
        </h1>

        <h2 style={{ textAlign: "center", fontSize: "21px" }}>
          {isRegister ? t.register : t.login}
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
            {t.email}
          </button>

          <button
            type="button"
            onClick={() => {
              setMethod("phone");
              setMessage(t.phoneMessage);
            }}
            style={{
              ...tabStyle,
              background: method === "phone" ? "#16834a" : "#eee",
              color: method === "phone" ? "white" : "#333"
            }}
          >
            {t.phone}
          </button>
        </div>

        {method === "email" && (
          <>
            <label>{t.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              style={inputStyle}
            />

            <label>{t.password}</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
            >
              {loading
                ? t.wait
                : isRegister
                ? t.submitRegister
                : t.submitLogin}
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
            {t.phoneSoon}
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
            {isRegister ? t.haveAccount : t.noAccount}

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
              {isRegister ? t.switchLogin : t.switchRegister}
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
