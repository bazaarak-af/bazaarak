
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function ListingDetails() {
  const params = useParams();
  const id = params.id;

  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadListing() {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .eq("status", "approved")
        .single();

      if (error || !data) {
        setMessage("این آگهی پیدا نشد یا هنوز تأیید نشده است.");
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

  if (loading) {
    return (
      <main dir="rtl" style={{ padding: 30 }}>
        در حال دریافت اطلاعات آگهی...
      </main>
    );
  }

  if (!listing) {
    return (
      <main dir="rtl" style={{ padding: 30 }}>
        <p>{message}</p>
        <Link href="/">بازگشت به صفحه اصلی</Link>
      </main>
    );
  }

  const whatsappNumber = (listing.whatsapp || listing.phone || "")
    .replace(/\D/g, "");

  return (
    <main dir="rtl" style={{
      maxWidth: 850,
      margin: "25px auto",
      padding: 20,
      fontFamily: "Arial",
      color: "#222",
      background: "#f5f8f5",
      minHeight: "100vh",
    }}>
      <Link href="/" style={{
        color: "#16834a",
        textDecoration: "none",
      }}>
        ← بازگشت به بازارک
      </Link>

      <article style={{
        background: "white",
        padding: 20,
        borderRadius: 14,
        marginTop: 20,
      }}>
        <h1 style={{ color: "#16834a" }}>
          {listing.title}
        </h1>

        <h2 style={{ color: "#16834a" }}>
          {listing.price
            ? Number(listing.price).toLocaleString() + " افغانی"
            : "قیمت توافقی"}
        </h2>

        <h3>عکس‌های آگهی</h3>

        {images.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 10,
          }}>
            {images.map((img) => (
              <a
                key={img.id}
                href={img.image_url}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={img.image_url}
                  alt={listing.title}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                />
              </a>
            ))}
          </div>
        ) : (
          <p>برای این آگهی عکسی ثبت نشده است.</p>
        )}

        <h3>توضیحات آگهی</h3>
        <p style={{ lineHeight: 2, whiteSpace: "pre-wrap" }}>
          {listing.description}
        </p>

        <hr style={{ border: "0", borderTop: "1px solid #eee" }} />

        <p>📍 شهر: {listing.city}</p>
        <p>📞 شماره تماس: {listing.phone}</p>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginTop: 20,
        }}>
          <a
            href={`tel:${listing.phone}`}
            style={{
              background: "#16834a",
              color: "white",
              padding: "12px 20px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            تماس با فروشنده
          </a>

          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#25D366",
                color: "white",
                padding: "12px 20px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              ارتباط در واتساپ
            </a>
          )}
        </div>
      </article>
    </main>
  );
}

