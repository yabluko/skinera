export interface OrderItem {
  id: number;
  name: {
    en: string;
    ua: string;
  };
  price: number;
  quantity: number;
  image_url?: string;
  category?: string;
  brand?: string;
  size?: string;
  capacity: number;
}

export interface Order {
  id: string;
  userId?: string;
  userEmail?: string;
  userName: string;
  userPhone: string;
  items: OrderItem[];
  total: number;
  delivery: {
    city: string;
    cityRef: string;
    department: string;
    departmentRef: string;
  };
  payment: {
    method: string;
    methodLabel: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  userEmail?: string;
  userName: string;
  userPhone: string;
  items: OrderItem[];
  total: number;
  delivery: {
    city: string;
    cityRef: string;
    department: string;
    departmentRef: string;
  };
  payment: {
    method: string;
    methodLabel: string;
  };
}
