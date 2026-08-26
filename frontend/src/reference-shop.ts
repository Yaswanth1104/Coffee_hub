import type { Coffee } from "./types/coffee";

export const coffeeImages: Record<string, string> = {
  cappuccino: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=900&q=90",
  americano: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=90",
  latte: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=90",
  "cold brew": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=90",
  mocha: "https://images.unsplash.com/photo-1579493519248-3d7c8c7c2b10?auto=format&fit=crop&w=900&q=90",
  espresso: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&q=90"
};

export const fallbackImage = "/coffee-images/coffee-default.svg";

export function coffeeImage(name?: string | null) {
  const key = typeof name === "string" ? name.trim().toLowerCase() : "";
  return coffeeImages[key] || fallbackImage;
}

export function readCart(): Array<Coffee & { quantity: number }> {
  try {
    return JSON.parse(localStorage.getItem("coffeehub_cart") || "[]");
  } catch {
    return [];
  }
}

export function saveCart(items: Array<Coffee & { quantity: number }>) {
  localStorage.setItem("coffeehub_cart", JSON.stringify(items));
  window.dispatchEvent(new Event("coffeehub:cart-updated"));
}

export function addCoffee(coffee: Coffee) {
  const items = readCart();
  const existing = items.find((i) => i.id === coffee.id);
  saveCart(
    existing
      ? items.map((i) =>
          i.id === coffee.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      : [...items, { ...coffee, quantity: 1 }]
  );
}

export const popularNames = ["Cappuccino", "Americano", "Latte", "Cold Brew", "Mocha"];
