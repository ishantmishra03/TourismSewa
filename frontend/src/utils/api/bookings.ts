import api from "../../config/axios";

export interface BookingData {
  tourist: string;
  experience: string;
  date: Date;
  message?: string;
  contactNumber: string;
  email: string;
  noOfPersons: number;
}

export interface Experience {
  _id: string;
  name: string;
  description: string;
  pricePerPerson: number;
}

export interface User {
  _id: string;
  username?: string;
  name?: string;
  email: string;
}

export interface Booking {
  _id: string;
  tourist: User;
  experience: Experience;
  date: string;
  message?: string;
  contactNumber: string;
  email: string;
  noOfPersons: number;
  totalAmount?: number;
  status?: "pending" | "confirmed" | "canceled";
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingResponse {
  success: boolean;
  booking: Booking;
  message: string;
}

export interface FetchBookingsResponse {
  success: boolean;
  bookings: Booking[];
  message?: string;
}

export async function createBooking(
  data: BookingData
): Promise<CreateBookingResponse> {
  const res = await api.post("/bookings", data, { withCredentials: true });
  return res.data;
}

export async function fetchUserBookings(): Promise<FetchBookingsResponse> {
  const res = await api.get("/bookings/get", { withCredentials: true });
  return res.data;
}
