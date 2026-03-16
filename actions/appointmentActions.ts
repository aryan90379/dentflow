"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.instasnap.tech";

async function getAuthHeaders() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");
  
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session.accessToken}`,
  };
}

export async function getAppointmentsAction() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/appointments`, {
      method: "GET",
      headers,
      cache: 'no-store'
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch appointments");
    
    return data;
  } catch (error: any) {
    console.error("Server Action Error (getAppointmentsAction):", error.message);
    return [];
  }
}

export async function createAppointmentAction(payload: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/appointments`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to create appointment");
    
    return { success: true, appointment: data.appointment };
  } catch (error: any) {
    console.error("Server Action Error (createAppointmentAction):", error.message);
    return { success: false, error: error.message };
  }
}

export async function getAppointmentDetailsAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) throw new Error("Unauthorized");
    
    const response = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
      cache: 'no-store'
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch details");
    
    return data;
  } catch (error: any) {
    console.error(`Server Action Error (getAppointmentDetailsAction - ${id}):`, error.message);
    return null;
  }
}