export interface Coffee {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

export interface CoffeeCreate {
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}