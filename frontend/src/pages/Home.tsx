import { useMemo, useState } from "react";
import "../reference-home.css";

interface Coffee {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

interface HomeProps {
  coffees: Coffee[];
  onLogin: () => void;
}

const imageMap: Record<string, string> = {
  cappuccino: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=1100&q=90",
  americano: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1100&q=90",
  latte: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1100&q=90",
  "cold brew": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1100&q=90",
  mocha: "https://images.unsplash.com/photo-1579493519248-3d7c8c7c2b10?auto=format&fit=crop&w=1100&q=90",
  espresso: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=1100&q=90",
};

const fallback = "/coffee-images/coffee-default.svg";
const getImage = (name: string) => imageMap[name.trim().toLowerCase()] || fallback;
const popularOrder = ["Cappuccino", "Americano", "Latte", "Cold Brew", "Mocha"];

export default function Home({ coffees, onLogin }: HomeProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const available = useMemo(() => coffees.filter((coffee) => coffee.is_available), [coffees]);
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(available.map((coffee) => coffee.category).filter(Boolean)))],
    [available],
  );
  const filtered = useMemo(
    () => (activeCategory === "All" ? available : available.filter((coffee) => coffee.category === activeCategory)),
    [activeCategory, available],
  );
  const popular = useMemo(() => {
    const ordered = popularOrder
      .map((name) => available.find((coffee) => coffee.name.toLowerCase() === name.toLowerCase()))
      .filter(Boolean) as Coffee[];
    return ordered.length ? ordered : available.slice(0, 5);
  }, [available]);

  const addToCart = (coffee: Coffee) =>
    window.dispatchEvent(new CustomEvent("coffeehub:add-to-cart", { detail: coffee }));
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="reference-home">
      <section className="ref-hero" id="home">
        <div className="ref-hero-glow" />
        <div className="ref-hero-content">
          <div className="ref-rating">
            <span className="google-g">G</span>
            <strong>Google</strong>
            <span className="ref-stars">★★★★★</span>
            <b>(4.9)</b>
          </div>
          <p className="ref-eyebrow">SPECIALTY COFFEE · ROASTED DAILY</p>
          <h1>Brewed to<br /><em>perfection.</em></h1>
          <p className="ref-hero-copy">Your perfect spot for coffee, pastries, and more.</p>
          <div className="ref-hero-actions">
            <button className="ref-primary" onClick={() => scrollTo("menu")}>Explore menu <span>→</span></button>
            <button className="ref-story-play" onClick={() => scrollTo("story")} aria-label="Watch our story">▶</button>
            <button className="ref-story-link" onClick={() => scrollTo("story")}>Watch our story</button>
          </div>
          <div className="ref-trust-row"><span>★</span> Loved by coffee people <b>·</b> Freshly roasted every day</div>
        </div>
        <div className="ref-hero-art">
          <div className="ref-hero-orbit orbit-one" />
          <div className="ref-hero-orbit orbit-two" />
          <div className="ref-hero-beans">●　●　●</div>
          <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1300&q=92" alt="Fresh specialty coffee" />
          <span className="ref-splash splash-one" />
          <span className="ref-splash splash-two" />
          <span className="ref-floating-bean bean-1">◆</span>
          <span className="ref-floating-bean bean-2">●</span>
          <span className="ref-floating-bean bean-3">●</span>
        </div>
      </section>

      <section className="ref-values">
        <div><span>◉</span><article><strong>Premium Beans</strong><small>Sourced from the best<br />coffee regions.</small></article></div>
        <div><span>♨</span><article><strong>Expertly Roasted</strong><small>Roasted to perfection<br />for rich flavor.</small></article></div>
        <div><span>☕</span><article><strong>Freshly Brewed</strong><small>Brewed fresh for you,<br />every single time.</small></article></div>
        <div><span>♥</span><article><strong>Made with Love</strong><small>Crafted with care<br />and passion.</small></article></div>
      </section>

      <section className="ref-popular" id="popular">
        <div className="ref-section-title">
          <div><small>CURATED FOR YOU</small><h2>Our Popular Picks <em>⌁</em></h2></div>
          <button onClick={() => scrollTo("menu")}>View all menu <span>→</span></button>
        </div>
        <div className="ref-popular-grid">
          {popular.map((coffee) => (
            <article className="ref-product-card" key={coffee.id}>
              <div className="ref-product-image">
                <img src={getImage(coffee.name)} alt={coffee.name} onError={(event) => { event.currentTarget.src = fallback; }} />
                <button className="ref-heart" aria-label={`Favourite ${coffee.name}`}>♡</button>
                <span>{coffee.category || "Coffee"}</span>
              </div>
              <div className="ref-product-body">
                <h3>{coffee.name}</h3>
                <p>{coffee.description}</p>
                <strong>₹{coffee.price}</strong>
                <button className="ref-add-round" onClick={() => addToCart(coffee)}>+</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ref-menu" id="menu">
        <div className="ref-menu-head">
          <div><small>THE COFFEE BAR</small><h2>Pick your perfect cup.</h2></div>
          <p>Freshly prepared favourites, from bold espresso to smooth cold brews.</p>
        </div>
        <div className="ref-tabs">
          {categories.map((category) => (
            <button key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)}>{category}</button>
          ))}
        </div>
        <div className="ref-menu-grid">
          {filtered.map((coffee) => (
            <article className="ref-menu-card" key={coffee.id}>
              <img src={getImage(coffee.name)} alt={coffee.name} onError={(event) => { event.currentTarget.src = fallback; }} />
              <div><span>{coffee.category}</span><h3>{coffee.name}</h3><p>{coffee.description}</p><strong>₹{coffee.price}</strong><button onClick={() => addToCart(coffee)}>Add to cart <b>+</b></button></div>
            </article>
          ))}
        </div>
        {!filtered.length && <div className="ref-empty">No coffee available in this category.</div>}
      </section>

      <section className="ref-promo" id="contact">
        <div className="ref-promo-art" />
        <div className="ref-promo-copy"><strong>10%</strong><span><b>Get 10% off on your first order!</b><small>Join our coffee community and enjoy exclusive offers.</small></span></div>
        <button onClick={onLogin}>Join Now <span>→</span></button>
      </section>

      <section className="ref-story" id="story">
        <div className="ref-story-card"><span>COFFEEHUB</span><strong>Good coffee<br /><i>takes its time.</i></strong><small>ROASTED WITH INTENTION · BREWED WITH CARE</small></div>
        <div className="ref-story-copy"><small>OUR STORY</small><h2>More than coffee.<br /><i>It's a moment.</i></h2><p>At CoffeeHub, we believe great coffee should slow things down. We source thoughtfully, roast in small batches, and make every cup with the kind of care you'd expect from your favourite neighbourhood café.</p><button className="ref-primary" onClick={onLogin}>Join CoffeeHub <span>→</span></button></div>
      </section>
    </main>
  );
}
