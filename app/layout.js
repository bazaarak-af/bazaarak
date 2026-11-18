
import "./globals.css";

export const metadata = {
  title: "بازارک | بازار آنلاین افغانستان",
  description: "خرید و فروش آسان در سراسر افغانستان",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
