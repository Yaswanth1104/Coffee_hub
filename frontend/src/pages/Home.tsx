import { useMemo, useState } from "react";
import CoffeeScene from "../components/CoffeeScene";

interface Coffee { id:number; name:string; description:string; price:number; category:string; is_available:boolean; }
interface HomeProps { coffees:Coffee[]; onLogin:()=>void; }

const coffeeImageMap:Record<string,string>={
  mocha:"/coffee-images/mocha.jpg", americano:"/coffee-images/americano.jpg", espresso:"/coffee-images/espresso.jpg",
  "cold brew":"/coffee-images/cold-brew.jpg", latte:"/coffee-images/latte.jpg", cappuccino:"/coffee-images/cappuccino.jpg",
  macchiato:"/coffee-images/macchiato.jpg", "iced coffee":"/coffee-images/iced-coffee.jpg"
};
const defaultCoffeeImage="/coffee-images/coffee-default.svg";
function getCoffeeImage(name:string){return coffeeImageMap[name.trim().toLowerCase()]||defaultCoffeeImage;}

function Home({coffees,onLogin}:HomeProps){
  const[activeCategory,setActiveCategory]=useState("All");
  const availableCoffees=coffees.filter(c=>c.is_available);
  const categories=useMemo(()=>["All",...Array.from(new Set(availableCoffees.map(c=>c.category).filter(Boolean)))],[availableCoffees]);
  const filteredCoffees=useMemo(()=>activeCategory==="All"?availableCoffees:availableCoffees.filter(c=>c.category===activeCategory),[activeCategory,availableCoffees]);
  const featured=filteredCoffees[0];

  return <main className="coffee-page home-v2 overflow-hidden">
    <section className="home-v2-hero">
      <div className="coffee-container home-v2-hero-grid">
        <div className="home-v2-copy">
          <div className="home-v2-eyebrow"><span/>SPECIALTY COFFEE / EST. 2026</div>
          <h1>Slow mornings.<br/><em>Bold coffee.</em><br/>Good company.</h1>
          <p>Small-batch roasted beans, carefully brewed for people who believe a coffee break should feel like a little escape.</p>
          <div className="home-v2-actions"><a href="#menu" className="coffee-button">Explore the menu <span>↗</span></a><a href="#about" className="home-v2-text-link">Our story <span>↓</span></a></div>
          <div className="home-v2-proof"><div><strong>5+</strong><span>Fresh brews</span></div><div><strong>100%</strong><span>Made to order</span></div><div><strong>2026</strong><span>Our first chapter</span></div></div>
        </div>
        <div className="home-v2-visual">
          <div className="home-v2-orbit orbit-one"/><div className="home-v2-orbit orbit-two"/>
          <div className="home-v2-scene"><CoffeeScene/></div>
          <div className="home-v2-sticker"><span>CRAFTED DAILY</span><strong>Fresh.<br/>Warm.<br/>Yours.</strong></div>
          <div className="home-v2-bean bean-one">●</div><div className="home-v2-bean bean-two">●</div>
        </div>
      </div>
    </section>

    <section className="home-v2-marquee" aria-label="CoffeeHub values"><div>CAREFULLY SOURCED <span>✦</span> SMALL-BATCH ROASTED <span>✦</span> FRESHLY BREWED <span>✦</span> MADE FOR SLOW MOMENTS <span>✦</span></div></section>

    <section id="menu" className="home-v2-menu">
      <div className="coffee-container">
        <div className="home-v2-section-head"><div><p className="home-v2-kicker">THE COFFEE BAR</p><h2>Pick your perfect cup.</h2></div><p>From strong espresso shots to smooth cold brews — every cup is prepared fresh.</p></div>
        {availableCoffees.length>0&&<div className="home-v2-tabs" role="tablist" aria-label="Coffee categories">{categories.map(category=><button key={category} type="button" onClick={()=>setActiveCategory(category)} aria-selected={activeCategory===category} className={activeCategory===category?"active":""}>{category}</button>)}</div>}
        {filteredCoffees.length===0?<div className="coffee-card p-10 text-center"><div className="text-5xl mb-4">☕</div><h3 className="text-xl font-bold coffee-heading">Menu coming soon</h3><p className="coffee-muted mt-2">Our coffee menu is being prepared.</p></div>:<div className="home-v2-menu-grid">
          {filteredCoffees.map((coffee,index)=><article key={coffee.id} className={`home-v2-coffee-card ${index===0?"featured":""}`}>
            <div className="home-v2-card-image"><img src={getCoffeeImage(coffee.name)} alt={`${coffee.name} coffee`} onError={event=>{const image=event.currentTarget;if(image.src.endsWith("coffee-default.svg"))return;image.src=defaultCoffeeImage}}/><span className="home-v2-category">{coffee.category}</span><span className="home-v2-price">₹{coffee.price}</span></div>
            <div className="home-v2-card-body"><div><h3>{coffee.name}</h3><p>{coffee.description}</p></div><div className="home-v2-card-footer"><span><i/> Available</span><button type="button" onClick={()=>window.dispatchEvent(new CustomEvent("coffeehub:add-to-cart",{detail:coffee}))}>Add to cart <b>+</b></button></div></div>
          </article>)}
        </div>}
        {availableCoffees.length>0&&<p className="home-v2-count">Showing {filteredCoffees.length} of {availableCoffees.length} available coffees</p>}
      </div>
    </section>

    <section id="about" className="home-v2-about"><div className="coffee-container home-v2-about-grid"><div className="home-v2-about-image"><div className="home-v2-about-card"><span>COFFEEHUB</span><strong>Good coffee<br/><em>takes its time.</em></strong><small>Roasted with intention · brewed with care</small></div></div><div className="home-v2-about-copy"><p className="home-v2-kicker">OUR STORY</p><h2>More than coffee.<br/><em>It's a moment.</em></h2><p>At CoffeeHub, we believe great coffee should slow things down. We source thoughtfully, roast in small batches, and make every cup with the kind of care you'd expect from your favourite neighbourhood café.</p><div className="home-v2-story-points"><div><strong>01</strong><span>Thoughtful sourcing</span></div><div><strong>02</strong><span>Small-batch roasting</span></div><div><strong>03</strong><span>Freshly brewed</span></div></div><button onClick={onLogin} className="coffee-button">Join CoffeeHub <span>→</span></button></div></div></section>
  </main>;
}
export default Home;
