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

const heroImage = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1800&q=92";
const storyImage = "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=90";
const craftImage = "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=90";

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

  const addToCart = (coffee: Coffee) => {
    window.dispatchEvent(new CustomEvent("coffeehub:add-to-cart", { detail: coffee }));
  };

  return (
    <main className="reference-home">
      <section className="lux-hero" id="home">
        <div className="lux-hero-image" aria-hidden="true">
          <img src={heroImage} alt="" />
          <div className="lux-hero-image-overlay" />
        </div>
        <div className="lux-hero-content">
          <p className="lux-kicker">SPECIALTY COFFEE · EST. 2024</p>
          <h1>Slow mornings.<br /><em>Great coffee.</em></h1>
          <p className="lux-hero-copy">
            Carefully sourced beans, beautifully roasted and brewed for the moments worth slowing down for.
          </p>
          <div className="lux-actions">
            <button className="lux-button lux-button-primary" onClick={() => navigate("/menu")}>
              Explore the menu <span>↗</span>
            </button>
            <button className="lux-text-button" onClick={() => navigate("/story")}>
              Discover our story <span>→</span>
            </button>
          </div>
        </div>
        <div className="lux-hero-note">
          <span className="lux-note-line" />
          <span>ROASTED WITH INTENTION</span>
        </div>
        <div className="lux-scroll">SCROLL TO EXPLORE <span>↓</span></div>
      </section>

      <section className="lux-marquee" aria-label="CoffeeHub highlights">
        <span>SMALL BATCH ROASTING</span><i>✦</i><span>SPECIALTY BEANS</span><i>✦</i><span>FRESH EVERY DAY</span><i>✦</i><span>MADE WITH CARE</span><i>✦</i>
      </section>

      <section className="lux-intro">
        <div className="lux-intro-label"><span>01</span><span>THE COFFEEHUB WAY</span></div>
        <div className="lux-intro-copy">
          <p className="lux-kicker">MORE THAN A CUP</p>
          <h2>A little <em>ritual</em><br />in every pour.</h2>
          <p>We believe great coffee is not about rushing. It is about good beans, skilled hands and a place that makes you want to stay a little longer.</p>
          <button className="lux-outline-button" onClick={() => navigate("/story")}>Our story <span>→</span></button>
        </div>
        <div className="lux-intro-visual">
          <img src={storyImage} alt="Coffee being prepared at CoffeeHub" />
          <span>FROM BEAN<br />TO MOMENT</span>
        </div>
      </section>

      <section className="lux-menu-section" id="popular">
        <div className="lux-section-head">
          <div>
            <p className="lux-kicker">THE HOUSE FAVOURITES</p>
            <h2>Made for your<br /><em>coffee break.</em></h2>
          </div>
          <button className="lux-text-button" onClick={() => navigate("/menu")}>View full menu <span>↗</span></button>
        </div>

        <div className="lux-product-grid">
          {popular.map((coffee, index) => (
            <article className={`lux-product-card ${index === 0 ? "is-featured" : ""}`} key={coffee.id}>
              <button className="lux-product-image" onClick={() => navigate(`/product/${coffee.id}`)} aria-label={`View ${coffee.name}`}>
                <img src={getImage(coffee.name)} alt={coffee.name} onError={(event) => { event.currentTarget.src = fallback; }} />
                <span className="lux-product-index">0{index + 1}</span>
                <span className="lux-view">VIEW ↗</span>
              </button>
              <div className="lux-product-info">
                <div>
                  <p>{coffee.category || "SPECIALTY COFFEE"}</p>
                  <h3>{coffee.name}</h3>
                </div>
                <div className="lux-product-bottom">
                  <strong>₹{coffee.price}</strong>
                  <button className="lux-add" onClick={() => addToCart(coffee)} aria-label={`Add ${coffee.name} to cart`}>+</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="lux-craft">
        <div className="lux-craft-image">
          <img src={craftImage} alt="Freshly brewed coffee" />
          <span>CRAFTED<br />DAILY</span>
        </div>
        <div className="lux-craft-copy">
          <p className="lux-kicker">WHY COFFEEHUB</p>
          <h2>Details make<br /><em>the difference.</em></h2>
          <div className="lux-feature-list">
            <div><span>01</span><article><h3>Premium beans</h3><p>Thoughtfully sourced from exceptional coffee-growing regions.</p></article></div>
            <div><span>02</span><article><h3>Expert roasting</h3><p>Small-batch roasted to bring out sweetness, body and balance.</p></article></div>
            <div><span>03</span><article><h3>Freshly brewed</h3><p>Every cup prepared with patience, precision and care.</p></article></div>
          </div>
        </div>
      </section>

      <section className="lux-statements">
        <div><strong>01</strong><p>We choose quality<br /><em>over quantity.</em></p></div>
        <div><strong>02</strong><p>We make space<br /><em>for slow moments.</em></p></div>
        <div><strong>03</strong><p>We serve coffee<br /><em>worth remembering.</em></p></div>
      </section>

      <section className="lux-cta" id="contact">
        <div className="lux-cta-glow" />
        <p className="lux-kicker">YOUR NEXT FAVOURITE CUP</p>
        <h2>Come for the coffee.<br /><em>Stay for the feeling.</em></h2>
        <p>Join the CoffeeHub community and get 10% off your first order.</p>
        <div className="lux-cta-actions">
          <button className="lux-button lux-button-primary" onClick={onLogin}>Join CoffeeHub <span>↗</span></button>
          <button className="lux-text-button" onClick={() => navigate("/menu")}>Browse the menu <span>→</span></button>
        </div>
      </section>
    </main>
  );
}
