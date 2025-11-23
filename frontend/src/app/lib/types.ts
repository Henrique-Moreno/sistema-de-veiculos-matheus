export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
  is_reserved: boolean;
  photo_url: string | null;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  is_super_admin: boolean;
  is_active: boolean;
  permissions: string[];
  created_at: string;
  last_login?: string;
}

export interface AdminLoginResponse {
  message: string;
  token: string;
  admin: Admin;
}

export interface Purchase {
  id: number;
  user_id: number;
  vehicle_id: number;
  reservation_id: number;
  final_price: number;
  status: string;
  created_at: string;
  vehicle?: Vehicle;
  buyer?: User;
  reservation?: any;
  review?: Review;
}

export interface Review {
  id: number;
  purchase_id: number;
  vehicle_rating: number;
  service_rating: number;
  comment: string | null;
  created_at: string;
  purchase?: Purchase;
}

export interface PopularVehicle {
  marca: string;
  modelo: string;
  sales_count: number;
}

export interface SalesDashboard {
  total_sales: number;
  total_revenue: number;
  recent_sales: number;
  popular_vehicles: PopularVehicle[];
  recent_reviews: Review[];
}

export interface SalesReport {
  period: {
    start_date?: string;
    end_date?: string;
  };
  total_sales: number;
  total_revenue: number;
  average_sale_value: number;
  sales: Purchase[];
}

export interface AdminLog {
  id: number;
  admin_id: number;
  admin_username: string;
  action: string;
  description: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface UsersListResponse {
  users: User[];
  total: number;
}

export interface AdminsListResponse {
  admins: Admin[];
  total: number;
}

export interface VehiclesListResponse {
  vehicles: Vehicle[];
  total: number;
}

export interface InspectionsListResponse {
  inspections: any[];
  total: number;
}

export interface ReservationsListResponse {
  reservations: any[];
  total: number;
}

export interface ReviewsListResponse {
  reviews: Review[];
  total: number;
}

export interface LogsListResponse {
  logs: AdminLog[];
  total: number;
  pages: number;
  current_page: number;
}