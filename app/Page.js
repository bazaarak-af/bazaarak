
const categories = [
  "املاک",
  "وسایل نقلیه",
  "لوازم الکترونیکی",
  "خانه و آشپزخانه",
  "کشاورزی",
  "دام و طیور",
  "استخدام و کاریابی",
  "خدمات",
  "پوشاک",
];

export default function Home() {
  return (
    <main className="site">
      <header className="header">
        <h1>بازارک</h1>
        <p>بازار آنلاین افغانستان</p>
      </header>

      <section className="hero">
        <h2>هر چیزی را آسان پیدا کن!</h2>
        <p>خرید و فروش آسان در سراسر افغانستان</p>
        <input
          type="search"
          placeholder="دنبال چه چیزی می‌گردی؟"
        />
        <button>جستجو</button>
      </section>

      <section className="categories">
        <h2>دسته‌بندی آگهی‌ها</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <div className="category" key={category}>
              {category}
            </div>
          ))}
        </div>
      </section>

      <footer>
        بازارک؛ بازار همه مردم افغانستان
      </footer>
    </main>
  );
}
