// Shared types between frontend and backend

export type UserRole = 'CLIENT' | 'ADMIN';

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'AWAITING_PAYMENT'
  | 'PAID'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: number;
  image: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  serviceId: string;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  price: number;
  notes: string | null;
  service: Service;
  customer?: Pick<User, 'id' | 'name' | 'email' | 'phone'>;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
