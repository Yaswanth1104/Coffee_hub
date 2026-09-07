import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CoffeeScene from "../components/CoffeeScene";
import "../reference-home.css";

interface Coffee { id:number; name:string; description:string; price:number; category:string; is_available:boolean; }
interface HomeProps { coffees:Coffee[]; onLogin:()=>void; }

const images={
  hero:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1800&q=92",
  story:"https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=90",
  craft:"https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=90",
  atmosphere:"https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=90"
};
const coffeeImages:Record<string,string>={
  cappuccino:"https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=1000&q=90",
  americano:"https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=90",
  latte:"https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1000&q=90",
  "cold brew":"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1000&q=90",
  mocha:"https://images.unsplash.com/photo-1579493519248-3d7c8c7c2b10?auto=format&fit=crop&w=1000&q=90",
  espresso:"https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=1000&q=90"
};
const fallback="/coffee-images/coffee-default.svg";
const preferred=["Cappuccino","Latte","Americano","Cold Brew","Mocha"];
const getCoffeeImage=(name:string)=>coffeeImages[name.trim().toLowerCase()]||fallback;

export default function Home({coffees,onLogin}:HomeProps){
  const navigate=useNavigate();
  const available=useMemo(()=>coffees.filter(c=>c.is_available),[coffees]);
  const featured=useMemo(()=>{const picked=preferred.map(n=>available.find(c=>c.name.toLowerCase()===n.toLowerCase())).filter(Boolean) as Coffee[];return picked.length?picked:available.slice(0,5)},[available]);
  const addToCart=(coffee:Coffee)=>window.dispatchEvent(new CustomEvent("coffeehub:add-to-cart",{detail:coffee}));

  return <main className="professional-home">
    <section className="home-hero">
      <div className="home-hero-photo"><img src={images.hero} alt="Coffee served at CoffeeHub"/><span/></div>
      <div className="home-hero-copy">
        <div className="hero-badge"><span>✦</span> SPECIALTY COFFEE HOUSE <span>EST. 2024</span></div>
        <p className="hero-eyebrow">ROASTED WITH INTENTION</p>
        <h1>Good coffee.<br/><i>Better moments.</i></h1>
        <p>Thoughtfully sourced beans, expertly roasted, and brewed fresh for people who appreciate the little things.</p>
        <div className="hero-buttons"><button className="home-primary" onClick={()=>navigate("/menu")}>Explore our menu <b>↗</b></button><button className="home-link" onClick={()=>navigate("/story")}>Our story <b>→</b></button></div>
        <div className="hero-meta"><span><b>4.9</b> ★★★★★</span><span>•</span><span>LOVED BY COFFEE PEOPLE</span></div>
      </div>
      <div className="hero-3d-wrap"><div className="hero-3d-glow"/><CoffeeScene/><span className="hero-3d-caption">THE DAILY<br/><i>RITUAL</i></span></div>
      <div className="hero-side-label">SMALL BATCH<br/>SPECIALTY ROAST</div>
    </section>

    <section className="trust-strip"><div><strong>100%</strong><span>Premium beans</span></div><div><strong>24H</strong><span>Fresh roast promise</span></div><div><strong>5★</strong><span>Every cup matters</span></div><div><strong>∞</strong><span>Good conversations</span></div></section>

    <section className="home-story">
      <div className="section-number">01 <span>OUR PHILOSOPHY</span></div>
      <div className="story-copy"><p className="section-kicker">THE COFFEEHUB WAY</p><h2>Coffee is a<br/><i>daily ritual.</i></h2><p>We created CoffeeHub for the pause between busy moments. From the beans we choose to the way we serve them, everything is considered so your coffee can simply taste great.</p><button className="outline-button" onClick={()=>navigate("/story")}>Discover CoffeeHub <span>→</span></button></div>
      <div className="story-photo"><img src={images.story} alt="Fresh coffee beans"/><div>FROM BEAN<br/>TO MOMENT</div></div>
    </section>

    <section className="featured-section"><div className="section-heading-row"><div><p className="section-kicker">THE HOUSE MENU</p><h2>Favourites, <i>made fresh.</i></h2></div><button className="home-link" onClick={()=>navigate("/menu")}>View full menu <b>↗</b></button></div>
      <div className="coffee-grid">{featured.map((coffee,index)=><article className={`coffee-tile ${index===0?"featured":""}`} key={coffee.id}><button className="coffee-tile-photo" onClick={()=>navigate(`/product/${coffee.id}`)} aria-label={`View ${coffee.name}`}><img src={getCoffeeImage(coffee.name)} alt={coffee.name} onError={e=>{e.currentTarget.src=fallback}}/><span className="tile-number">0{index+1}</span><span className="tile-view">VIEW ↗</span></button><div className="coffee-tile-body"><small>{coffee.category||"SPECIALTY COFFEE"}</small><h3>{coffee.name}</h3><div><strong>₹{coffee.price}</strong><button className="tile-add" onClick={()=>addToCart(coffee)} aria-label={`Add ${coffee.name} to cart`}>+</button></div></div></article>)}</div>
    </section>

    <section className="experience-section"><div className="experience-photo"><img src={images.atmosphere} alt="CoffeeHub cafe atmosphere"/><span>YOUR TABLE<br/>IS WAITING</span></div><div className="experience-copy"><p className="section-kicker">THE EXPERIENCE</p><h2>Stay for the<br/><i>atmosphere.</i></h2><p>Warm light. Fresh coffee. A playlist that never gets in the way of conversation. CoffeeHub is designed to feel like your favourite corner of the city.</p><div className="experience-points"><div><b>01</b><span><strong>Slow mornings</strong><small>Start the day properly.</small></span></div><div><b>02</b><span><strong>Good company</strong><small>Bring someone you like.</small></span></div><div><b>03</b><span><strong>Great coffee</strong><small>Obviously.</small></span></div></div><button className="outline-button" onClick={()=>navigate("/contact")}>Find us <span>→</span></button></div></section>

    <section className="craft-section"><div className="craft-copy"><p className="section-kicker">WHY OUR COFFEE</p><h2>Details make<br/><i>the difference.</i></h2><p>We keep our process simple and our standards high. Better beans, careful roasting and a barista who takes the extra few seconds to get it right.</p><div className="craft-list"><div><b>01</b><span><strong>Premium sourcing</strong><small>Exceptional beans from trusted origins.</small></span></div><div><b>02</b><span><strong>Small-batch roasting</strong><small>Balanced for sweetness, body and clarity.</small></span></div><div><b>03</b><span><strong>Brewed to order</strong><small>Fresh, precise and never rushed.</small></span></div></div></div><div className="craft-photo"><img src={images.craft} alt="Coffee being brewed"/><span>CRAFTED<br/>DAILY</span></div></section>

    <section className="quote-section"><p className="section-kicker">A LITTLE REMINDER</p><blockquote>“The best conversations<br/>usually start with <i>coffee.</i>”</blockquote><div className="quote-line"/></section>
    <section className="home-cta"><div className="cta-orb"/><p className="section-kicker">MAKE IT A COFFEE DAY</p><h2>Your next favourite<br/><i>cup is waiting.</i></h2><p>Explore the menu, pick your ritual, and let us take care of the rest.</p><div><button className="home-primary" onClick={()=>navigate("/menu")}>Order your coffee <b>↗</b></button><button className="home-link" onClick={onLogin}>Join CoffeeHub <b>→</b></button></div></section>
  </main>;
}
