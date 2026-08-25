import type { Coffee, CoffeeCreate } from "../types/coffee";
export type { Coffee, CoffeeCreate } from "../types/coffee";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  pincode: string | null;
  created_at?: string;
}
export interface OrderItemInput { coffee_id: number; quantity: number; }
export interface OrderItem { coffee_id: number; coffee_name: string; unit_price: number; quantity: number; line_total: number; }
export interface Order { id: number; customer_id: number; customer_name: string; phone: string; address: string; city: string; pincode: string; subtotal: number; delivery_fee: number; total: number; status: string; payment_method: string; created_at: string; items: OrderItem[]; }
interface ApiErrorBody { detail?: string | Array<{ msg?: string }>; }
function getToken(key: "access_token" | "customer_access_token") { return localStorage.getItem(key); }
async function parseError(response: Response, fallback: string) { const body = (await response.json().catch(() => ({}))) as ApiErrorBody; if (typeof body.detail === "string") return body.detail; if (Array.isArray(body.detail)) { const message = body.detail.map((item) => item.msg).filter(Boolean).join(" · "); if (message) return message; } return fallback; }
export async function getCoffees(): Promise<Coffee[]> { const response = await fetch(`${API_BASE_URL}/coffees/`); if (!response.ok) throw new Error(await parseError(response, "Failed to fetch coffees")); return response.json(); }
export async function getCustomerProfile(): Promise<CustomerProfile> { const token = getToken("customer_access_token"); const response = await fetch(`${API_BASE_URL}/customer-profile/me`, { headers: { Authorization: `Bearer ${token}` } }); if (!response.ok) throw new Error(await parseError(response, "Unable to load your profile")); return response.json(); }
export async function updateCustomerProfile(input: Omit<CustomerProfile, "id" | "created_at">): Promise<CustomerProfile> { const token = getToken("customer_access_token"); const response = await fetch(`${API_BASE_URL}/customer-profile/me`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(input) }); if (!response.ok) { const error = new Error(await parseError(response, "Unable to update your profile")); Object.assign(error, { status: response.status }); throw error; } return response.json(); }
export async function createOrder(input: { customer_name: string; phone: string; address: string; city: string; pincode: string; payment_method: "cod"; items: OrderItemInput[]; }): Promise<Order> { const token = getToken("customer_access_token"); const response = await fetch(`${API_BASE_URL}/orders/`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(input) }); if (!response.ok) { const error = new Error(await parseError(response, "Unable to place order")); Object.assign(error, { status: response.status }); throw error; } return response.json(); }
export async function getMyOrders(): Promise<Order[]> { const token = getToken("customer_access_token"); const response = await fetch(`${API_BASE_URL}/orders/`, { headers: { Authorization: `Bearer ${token}` } }); if (!response.ok) { const error = new Error(await parseError(response, "Unable to load orders")); Object.assign(error, { status: response.status }); throw error; } return response.json(); }
export async function createCoffee(coffee: CoffeeCreate): Promise<Coffee> { const token = getToken("access_token"); const response = await fetch(`${API_BASE_URL}/coffees/`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(coffee) }); if (!response.ok) throw new Error(await parseError(response, "Failed to create coffee")); return response.json(); }
export async function updateCoffee(coffeeId: number, coffee: CoffeeCreate): Promise<Coffee> { const token = getToken("access_token"); const response = await fetch(`${API_BASE_URL}/coffees/${coffeeId}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(coffee) }); if (!response.ok) throw new Error(await parseError(response, "Failed to update coffee")); return response.json(); }
export async function deleteCoffee(coffeeId: number): Promise<void> { const token = getToken("access_token"); const response = await fetch(`${API_BASE_URL}/coffees/${coffeeId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); if (!response.ok) throw new Error(await parseError(response, "Failed to delete coffee")); }
