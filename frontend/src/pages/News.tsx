import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../reference-pages.css";

const stories = [
  { date: "AUG 24, 2026", tag: "COFFEE GUIDE", title: "How to enjoy a better cup at home.", text: "A few simple brewing habits can bring out more sweetness, balance, and aroma in every cup.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85" },
  { date: "AUG 18, 2026", tag: "BEHIND THE BEANS", title: "From bean to brew: the CoffeeHub way.", text: "Discover how thoughtful sourcing and careful roasting shape the flavour in your favourite coffee.", image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=85" },
  { date: "AUG 10, 2026", tag: "CAFE MOMENTS", title: "Coffee, conversation, and slow mornings.", text: "Sometimes the best part of coffee is the moment it creates. Take a little time to slow down.", image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=85" },
];

export default function News(){
  const navigate = useNavigate();
  return <><Navbar/><main className="ref-page"><div className="ref-page-shell">
    <section className="ref-page-card" style={{padding:"clamp(28px,5vw,64px)"}}>
      <span className="ref-page-kicker">COFFEEHUB JOURNAL</span>
      <h1 className="ref-page-heading" style={{fontSize:"clamp(46px,6vw,76px)",lineHeight:.95,margin:"14px 0 18px"}}>Fresh stories.<br/><em style={{color:"#b96935"}}>Fresh perspective.</em></h1>
      <p style={{fontSize:16,lineHeight:1.8,color:"#74665d",maxWidth:650}}>Brewing notes, coffee stories, and little things we're learning along the way.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginTop:38}}>
        {stories.map(story=><article key={story.title} style={{border:"1px solid #ead9c3",borderRadius:20,overflow:"hidden",background:"#fffaf4"}}>
          <img src={story.image} alt={story.title} style={{width:"100%",height:190,objectFit:"cover",display:"block"}}/>
          <div style={{padding:22}}><span className="ref-page-kicker">{story.tag}</span><p style={{fontSize:12,color:"#8b7668",margin:"9px 0"}}>{story.date}</p><h2 className="ref-page-heading" style={{fontSize:24,lineHeight:1.1,margin:"8px 0 12px"}}>{story.title}</h2><p style={{color:"#74665d",lineHeight:1.6,fontSize:14}}>{story.text}</p></div>
        </article>)}
      </div>
      <button className="ref-page-button" style={{marginTop:28}} onClick={()=>navigate("/menu")}>Explore our coffees →</button>
    </section>
  </div></main></>;
}
