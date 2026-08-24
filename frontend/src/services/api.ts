import type { Coffee, CoffeeCreate } from "../types/coffee";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function getCoffees(): Promise<Coffee[]> {
  const response = await fetch(`${API_BASE_URL}/coffees/`);

  if (!response.ok) {
    throw new Error("Failed to fetch coffees");
  }

  return response.json();
}

export async function createCoffee(
  coffee: CoffeeCreate
): Promise<Coffee> {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_BASE_URL}/coffees/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(coffee),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail || "Failed to create coffee"
    );
  }

  return response.json();
}

export async function updateCoffee(
  coffeeId: number,
  coffee: CoffeeCreate
): Promise<Coffee> {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/coffees/${coffeeId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(coffee),
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail || "Failed to update coffee"
    );
  }

  return response.json();
}

export async function deleteCoffee(
  coffeeId: number
): Promise<void> {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/coffees/${coffeeId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail || "Failed to delete coffee"
    );
  }
}