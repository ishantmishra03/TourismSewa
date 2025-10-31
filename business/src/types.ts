export type ExperienceType = "popular" | "hidden_gem" | string;

export interface Experience {
  _id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  location: string;
  image: string;
  type: ExperienceType;
  business: Business;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type BusinessCategory = "adventure" | "culture" | "food" | "nature";

export interface Business {
  _id: string;
  name: string;
  email: string;
  password: string;
  businessName: string;
  contactNumber: string;
  address: string;
  description?: string;
  verified?: boolean;
  categories: BusinessCategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  _id: string;
  tourist: string;
  experience: string;
  date: Date;
  message?: string;
  contactNumber: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}
