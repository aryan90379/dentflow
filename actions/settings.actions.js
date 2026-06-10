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

export async function fetchUserSettings() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/settings`, {
      method: "GET",
      headers,
      cache: 'no-store'
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch settings");
    return data.settings;
  } catch (error) {
    console.error("fetchUserSettings Action Error:", error);
    return null;
  }
}

export async function updateUserSettings(updatePayload: any) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/settings`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updatePayload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update settings");
    return { success: true, settings: data.settings };
  } catch (error: any) {
    console.error("updateUserSettings Action Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getCalendarAuthUrlAction() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/calendar/auth-url`, {
      method: "GET",
      headers,
      cache: 'no-store' 
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch auth URL");
    
    return data.url;
  } catch (error: any) {
    console.error("getCalendarAuthUrlAction Error:", error.message);
    return null;
  }
}

export async function linkWhatsAppAction(
  facebookAuthCode: string, 
  wabaId?: string | null, 
  phoneNumberId?: string | null
) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/settings/whatsapp/connect`, {
      method: "POST",
      headers,
      // Forward the auth code along with frontend intercepted asset IDs to the backend
      body: JSON.stringify({ 
        code: facebookAuthCode, 
        wabaId, 
        phoneNumberId 
      }) 
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to link WhatsApp");
    
    return { success: true };
  } catch (error: any) {
    console.error("linkWhatsAppAction Error:", error.message);
    return { success: false, error: error.message };
  }
}