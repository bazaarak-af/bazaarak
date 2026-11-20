
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

const texts = {
  fa: {
    back: "بازگشت به بازارک",
    loading: "در حال دریافت اطلاعات آگهی...",
    notFound: "این آگهی پیدا نشد یا هنوز تأیید نشده است.",
    photos: "تصاویر آگهی",
    noPhotos: "برای این آگهی عکسی ثبت نشده است.",
    description: "توضیحات آگهی",
    city: "ولایت",
    phone: "شماره تماس",
    price: "قیمت",
    negotiable: "قیمت توافقی",
    contact: "تماس با فروشنده",
    whatsapp: "ارتباط در واتساپ",
    home: "صفحه اصلی"
  },
  ps: {
    back: "بازارک ته بېرته ستنېدل",
    loading: "د اعلان معلومات ترلاسه کېږي...",
    notFound: "دا اعلان ونه موندل شو یا لا تایید شوی نه دی.",
    photos: "د اعلان انځورونه",
    noPhotos: "د دې اعلان لپاره انځور نشته.",
    description: "د اعلان تشریح",
    city: "ولایت",
    phone: "د اړیکې شمېره",
    price: "بیه",
    negotiable: "توافقي بیه",
    contact: "له پلورونکي سره اړیکه",
    whatsapp: "په واټساپ اړیکه",
    home: "کورپاڼه"
  },
  en: {
    back: "Back to Bazaarak",
    loading: "Loading listing details...",
    notFound: "This listing was not found or has not been approved.",
    photos: "Listing Photos",
    noPhotos: "No photos were added to this listing.",
    description: "Description",
    city: "Province",
    phone: "Phone number",
    price: "Price",
    negotiable: "Negotiable",
    contact: "Call seller",
    whatsapp: "Contact on WhatsApp",
    home: "Home"
  }
};

export default function ListingDetails() {
  const params = useParams();
  const id = params.id;

  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState("fa");

  const t = texts[lang];
  const direction = lang === "en" ? "ltr" : "rtl";

  useEffect(() => {
    const savedLanguage = localStorage.getItem("bazaarak-language");
    if (savedLanguage && texts[savedLanguage]) {
      setLang(savedLanguage);
    }
  }, []);

  useEffect(() => {
    async function loadListing() {
      setLoading(true);

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .eq("status", "approved")
        .single();

      if (error || !data) {
        setMessage("notFound");
        setLoading(false);
        return;
      }

      setListing(data);

      const { data: imageData, error: imageError } = await supabase
        .from("listing_images")
        .select("id, image_url")
        .eq("listing_id", id);

      if (imageError) {
        console.error("خطا در دریافت عکس‌ها:", imageError);
      } else {
        setImages(imageData || []);
      }

      setLoading(false);
    }

    if (id) loadListing();
  }, [id]);

  function changeLanguage(value) {
    setLang(value);
    localStorage.setItem("bazaarak-language", value);
  }

  if (loading) {
    return (
      <main dir="rtl" style={pageStyle}>
        <p style={{ textAlign: "center", padding: 50 }}>
          {t.loading}
        </p>
      </main>
    );
  }

  if (!listing) {
    return (
      <main dir="rtl" style={pageStyle}>
        <div style={containerStyle}>
          <h2>{t.notFound}</h2>
          <Link href="/" style={greenLink}>{t.home}</Link>
        </div>
      </main>
    );
  }

  const whatsappNumber = (listing.whatsapp || listing.phone || "")
    .replace(/\D/g, "");

  const price = listing.price
    ? Number(listing.price).toLocaleString(
        lang === "en" ? "en-US" : lang === "ps" ? "ps-AF" : "fa-AF"
      ) + (lang === "en" ? " AFN" : " افغانی")
    : t.negotiable;

  return (
    <main dir={direction} style={pageStyle}>
      <header style={headerStyle}>
        <Link href="/" style={logoStyle}>🛍️ بازارک</Link>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select
            value={lang}
            onChange={(e) => changeLanguage(e.target.value)}
            style={languageStyle}
            aria-label="Language"
          >
            <option value="fa">فارسی</option>
            <option value="ps">پښتو</option>
            <option value="en">English</option>
          </select>

          <Link href="/" style={greenLink}>{t.home}</Link>
        </div>
      </header>

      <div style={containerStyle}>
        <Link href="/" style={greenLink}>← {t.back}</Link>

        <div style={layoutStyle}>
          <section style={mainCardStyle}>
            <h2 style={sectionTitle}>{t.photos}</h2>

            {images.length > 0 ? (
              <>
                <div style={mainImageStyle}>
                  <img
                    src={images[activeImage]?.image_url}
                    alt={listing.title}
                    style={mainImageContent}
                  />
                </div>

                <div style={thumbnailGrid}>
                  {images.map((img, index) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      style={{
                        ...thumbnailButton,
                        border: activeImage === index
                          ? "3px solid #07804c"
                          : "2px solid #e5eee8"
                      }}
                    >
                      <img
                        src={img.image_url}
                        alt={`${listing.title} ${index + 1}`}
                        style={thumbnailImage}
                      />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={emptyImageStyle}>📦<p>{t.noPhotos}</p></div>
            )}

            <h2 style={sectionTitle}>{t.description}</h2>
            <p style={descriptionStyle}>
              {listing.description || "—"}
            </p>
          </section>

          <aside style={sideCardStyle}>
            <div style={priceBoxStyle}>
              <small>{t.price}</small>
              <h2>{price}</h2>
            </div>

            <h1 style={listingTitle}>{listing.title}</h1>

            <div style={detailRow}>
              <span>📍 {t.city}</span>
              <strong>{listing.city || "—"}</strong>
            </div>

            <div style={detailRow}>
              <span>📞 {t.phone}</span>
              <strong>{listing.phone || "—"}</strong>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid #e9eee9" }} />

            {listing.phone && (
              <a
                href={`tel:${listing.phone}`}
                style={callButton}
              >
                ☎️ {t.contact}
              </a>
            )}

            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                style={whatsappButton}
              >
                WhatsApp · {t.whatsapp}
              </a>
            )}

            <p style={safetyNote}>
              🛡️ بازارک برای ایجاد ارتباط میان خریدار و فروشنده تلاش می‌کند.
              پیش از پرداخت، کالا یا خدمات را بررسی کنید.
            </p>
          </aside>
        </div>
      </div>

      <footer style={footerStyle}>
        بازارک | Bazaarak
        <p>خرید و فروش آسان در سراسر افغانستان</p>
      </footer>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f4f8f5",
  color: "#18352a",
  fontFamily: "Arial, sans-serif"
};

const headerStyle = {
  background: "#fff",
  padding: "15px 5%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 15,
  borderBottom: "1px solid #e5eee8"
};

const logoStyle = {
  color: "#087c4b",
  fontSize: 25,
  fontWeight: 900,
  textDecoration: "none"
};

const languageStyle = {
  padding: 10,
  border: "1px solid #dce8df",
  borderRadius: 9,
  background: "#fff"
};

const greenLink = {
  color: "#087c4b",
  textDecoration: "none",
  fontWeight: 700
};

const containerStyle = {
  width: "90%",
  maxWidth: 1150,
  margin: "30px auto"
};

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.7fr) minmax(260px, 0.9fr)",
  gap: 22,
  marginTop: 22,
  alignItems: "start"
};

const mainCardStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 18,
  border: "1px solid #e5eee8"
};

const sideCardStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 18,
  border: "1px solid #e5eee8",
  position: "sticky",
  top: 15
};

const sectionTitle = {
  fontSize: 19,
  color: "#183d2d",
  margin: "10px 0 18px"
};

const mainImageStyle = {
  width: "100%",
  height: "clamp(240px, 45vw, 480px)",
  background: "#edf3ef",
  borderRadius: 14,
  overflow: "hidden"
};

const mainImageContent = {
  width: "100%",
  height: "100%",
  objectFit: "contain"
};

const thumbnailGrid = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 13
};

const thumbnailButton = {
  padding: 0,
  width: 78,
  height: 72,
  borderRadius: 10,
  overflow: "hidden",
  background: "#fff",
  cursor: "pointer"
};

const thumbnailImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};

const emptyImageStyle = {
  background: "#edf3ef",
  padding: 40,
  textAlign: "center",
  borderRadius: 14,
  fontSize: 35
};

const priceBoxStyle = {
  background: "#e8f5ed",
  padding: 17,
  borderRadius: 13,
  color: "#087c4b"
};

const listingTitle = {
  fontSize: 23,
  lineHeight: 1.7,
  margin: "20px 0"
};

const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  padding: "13px 0",
  borderBottom: "1px solid #edf1ed",
  flexWrap: "wrap"
};

const descriptionStyle = {
  lineHeight: 2.2,
  whiteSpace: "pre-wrap",
  color: "#52645a",
  marginBottom: 25
};

const callButton = {
  display: "block",
  textAlign: "center",
  background: "#07804c",
  color: "#fff",
  padding: 14,
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 700,
  marginTop: 15
};

const whatsappButton = {
  display: "block",
  textAlign: "center",
  background: "#25D366",
  color: "#fff",
  padding: 14,
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 700,
  marginTop: 12
};

const safetyNote = {
  background: "#f5f8f6",
  padding: 12,
  borderRadius: 10,
  fontSize: 12,
  lineHeight: 1.9,
  color: "#607267",
  marginTop: 20
};

const footerStyle = {
  background: "#123d2c",
  color: "#fff",
  padding: 28,
  textAlign: "center"
};
