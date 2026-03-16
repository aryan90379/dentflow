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

export async function getPatientsAction() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/patients`, {
      method: "GET",
      headers,
      cache: 'no-store'
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch patients");
    
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Server Action Error (getPatientsAction):", message);
    return [];
  }
}

export async function getPatientByIdAction(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
      method: "GET",
      headers,
      cache: 'no-store'
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch patient details");
    
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Server Action Error (getPatientByIdAction - ${id}):`, message);
    return { patient: null, treatments: [] };
  }
}

export async function createPatientAction(payload: any) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/patients`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create patient");
    
    return { success: true, patient: data.patient };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("createPatientAction Error:", message);
    return { success: false, error: message };
  }
}