import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar(){
 const navigate=useNavigate();
 const[customer,setCustomer]=useState<{name:string;email:string}|null>(()=>{try{return JSON.parse(localStorage.getItem("customer")||"null")}catch{return null}});
 useEffect(()=>{const sync=()=>{try{setCustomer(JSON.parse(localStorage.getItem("customer")||"null"))}catch{setCustomer(null)}};window.addEventListener("coffeehub:customer-auth",sync);window.addEventListener("storage",sync);return()=>{window.removeEventListener("coffeehub:customer-auth",sync);window.removeEventListener("storage",sync)}},[]);
 const logout=()=>{localStorage.removeItem("customer_access_token");localStorage.removeItem("customer");setCustomer(null);navigate("/")};
 const go=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
 const openCart=()=>window.dispatchEvent(new Event("coffeehub:open-cart"));
 return <nav className="reference-nav"><button className="reference-brand" onClick={()=>navigate("/")} aria-label="CoffeeHub home"><span className="reference-brand-mark">☕</span><span><strong>CoffeeHub</strong><small>Specialty Coffee</small></span></button><div className="reference-nav-links"><button onClick={()=>go("home")}>Home</button><button onClick={()=>go("menu")}>Menu</button><button onClick={()=>go("story")}>Our Story</button><button onClick={()=>go("popular")}>News</button><button onClick={()=>go("contact")}>Contact</button></div><div className="reference-nav-actions"><button className="reference-icon" onClick={()=>go("menu")} aria-label="Search">⌕</button><button className="reference-icon cart" onClick={openCart} aria-label="Open cart">🛒<span>3</span></button>{customer?<><button className="reference-user" onClick={()=>navigate("/profile")}><span>{customer.name.charAt(0).toUpperCase()}</span>{customer.name.split(" ")[0]}</button><button className="reference-signin" onClick={logout}>Logout</button></>:<button className="reference-signin" onClick={()=>navigate("/customer-auth")}>♙ &nbsp; Sign in</button>}</div><button className="reference-mobile" onClick={()=>navigate(customer?"/profile":"/customer-auth")}>{customer?customer.name.charAt(0).toUpperCase():"→"}</button></nav>;
}
export default Navbar;
