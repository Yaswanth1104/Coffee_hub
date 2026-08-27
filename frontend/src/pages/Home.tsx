import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

// Natural hero photograph. It is rendered directly into the hero background area
// and softly masked so there is no visible image/card rectangle.
const heroImage =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=92";

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
  const navigate = useNavigate();
  const available = useMemo(() => coffees.filter((coffee) => coffee.is_available), [coffees]);
  const popular = useMemo(() => {
    const ordered = popularOrder
      .map((name) => available.find((coffee) => coffee.name.toLowerCase() === name.toLowerCase()))
      .filter(Boolean) as Coffee[];
    return ordered.length ? ordered : available.slice(0, 5);
  }, [available]);

  const addToCart = (coffee: Coffee) =>
    window.dispatchEvent(new CustomEvent("coffeehub:add-to-cart", { detail: coffee }));

  return (
    <main className="reference-home">
      <section className="ref-hero" id="home">
        <div className="ref-hero-content">
          <div className="ref-rating">
            <span className="google-g">G</span>
            <strong>Google</strong>
            <span className="ref-stars">★★★★★</span>
            <b>(4.9)</b>
          </div>
          <p className="ref-eyebrow">GOOD COFFEE · BETTER DAYS</p>
          <h1>Brewed to<br /><em>perfection</em><span className="ref-leaf-mark">●</span></h1>
          <p className="ref-hero-copy">Your perfect spot for coffee,<br className="desktop-break" /> pastries, and more.</p>
          <div className="ref-hero-actions">
            <button className="ref-primary" onClick={() => navigate("/menu")}>Explore menu <span>→</span></button>
            <button className="ref-story-play" onClick={() => navigate("/story")} aria-label="Watch our story">▶</button>
            <button className="ref-story-link" onClick={() => navigate("/story")}>Watch our story</button>
          </div>
        </div>

        <div className="ref-hero-media" aria-hidden="true">
          <div className="ref-hero-glow" />
          <img src={heroImage} alt="" />
        </div>
      </section>

      <section className="ref-values" aria-label="CoffeeHub quality promise">
        <div><span>◉</span><article><strong>Premium Beans</strong><small>Sourced from the best<br />coffee regions.</small></article></div>
        <div><span>♨</span><article><strong>Expertly Roasted</strong><small>Roasted to perfection<br />for rich flavor.</small></article></div>
        <div><span>☕</span><article><strong>Freshly Brewed</strong><small>Brewed fresh for you,<br />every single time.</small></article></div>
        <div><span>♥</span><article><strong>Made with Love</strong><small>Crafted with care<br />and passion.</small></article></div>
      </section>

      <section className="ref-popular" id="popular">
        <div className="ref-section-title">
          <div><small>CURATED FOR YOU</small><h2>Our Popular Picks <em>⌁</em></h2></div>
          <button onClick={() => navigate("/menu")}>View all menu <span>→</span></button>
        </div>
        <div className="ref-popular-grid">
          {popular.map((coffee) => (
            <article className="ref-product-card" key={coffee.id}>
              <div className="ref-product-image">
                <img src={getImage(coffee.name)} alt={coffee.name} onError={(event) => { event.currentTarget.src = fallback; }} />
                <button className="ref-heart" aria-label={`Favourite ${coffee.name}`}>♡</button>
              </div>
              <div className="ref-product-body">
                <h3>{coffee.name}</h3>
                <strong>₹{coffee.price}</strong>
                <button className="ref-add-round" onClick={() => addToCart(coffee)} aria-label={`Add ${coffee.name} to cart`}>+</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ref-promo" id="contact">
        <div className="ref-promo-copy">
          <strong>10% <small>OFF</small></strong>
          <span><b>Get 10% off on your first order!</b><small>Join our coffee community and enjoy exclusive offers.</small></span>
        </div>
        <button onClick={onLogin}>Join Now <span>→</span></button>
      </section>
    </main>
  );
}
