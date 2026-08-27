import { useState } from "react";
import Navbar from "../components/Navbar";
import "../reference-pages.css";

export default function Contact(){
  const [sent,setSent]=useState(false);
  return <><Navbar/><main className="ref-page"><div className="ref-page-shell"><section className="ref-page-card" style={{padding:"clamp(28px,5vw,64px)"}}>
    <span className="ref-page-kicker">GET IN TOUCH</span>
    <h1 className="ref-page-heading" style={{fontSize:"clamp(46px,6vw,76px)",lineHeight:.95,margin:"14px 0 18px"}}>Let's talk<br/><em style={{color:"#b96935"}}>over coffee.</em></h1>
    <p style={{fontSize:16,lineHeight:1.8,color:"#74665d",maxWidth:620}}>Questions, feedback, or just want to say hello? Send us a message and the CoffeeHub team will get back to you.</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:36,marginTop:36}}>
      <div style={{background:"#ead9c3",borderRadius:20,padding:28}}><span className="ref-page-kicker">COFFEEHUB</span><h2 className="ref-page-heading" style={{fontSize:28,margin:"12px 0"}}>Come by anytime.</h2><p style={{color:"#74665d",lineHeight:1.7}}>Mon – Sun<br/>8:00 AM – 9:00 PM</p><p style={{color:"#74665d",lineHeight:1.7}}>hello@coffeehub.com<br/>+91 90000 00000</p></div>
      <form onSubmit={e=>{e.preventDefault();setSent(true)}} style={{display:"grid",gap:16}}>
        {sent&&<div style={{padding:14,borderRadius:12,background:"#edf8ef",color:"#26733b"}}>Thanks! Your message has been received.</div>}
        <input required placeholder="Your name" style={{padding:16,border:"1px solid #ddcbb8",borderRadius:12,background:"#fffaf4"}}/>
        <input required type="email" placeholder="Email address" style={{padding:16,border:"1px solid #ddcbb8",borderRadius:12,background:"#fffaf4"}}/>
        <textarea required placeholder="Your message" rows={6} style={{padding:16,border:"1px solid #ddcbb8",borderRadius:12,background:"#fffaf4",resize:"vertical"}}/>
        <button className="ref-page-button" type="submit">Send message →</button>
      </form>
    </div>
  </section></div></main></>;
}
