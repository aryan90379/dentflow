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

export async function updateUserSettings(updatePayload) {
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
  } catch (error) {
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
  } catch (error) {
    console.error("getCalendarAuthUrlAction Error:", error.message);
    return null;
  }
}

export async function linkWhatsAppAction(facebookAuthCode) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/settings/whatsapp/connect`, {
      method: "POST",
      headers,
      // 🔥 FIX: Send it explicitly as 'code' in the JSON body
      body: JSON.stringify({ code: facebookAuthCode }) 
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to link WhatsApp");
    
    // 🔥 FIX: Must return the phoneNumberId to the frontend so it can trigger the OTP
    return { success: true, phoneNumberId: data.phoneNumberId };
  } catch (error) {
    console.error("linkWhatsAppAction Error:", error.message);
    return { success: false, error: error.message };
  }
}

// 🔥 NEW: Action to Request OTP
export async function requestWhatsAppOtpAction(phoneNumberId) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/settings/whatsapp/request-otp`, {
      method: "POST",
      headers,
      body: JSON.stringify({ phoneNumberId })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to request OTP");
    
    return { success: true };
  } catch (error) {
    console.error("requestWhatsAppOtpAction Error:", error.message);
    return { success: false, error: error.message };
  }
}

// 🔥 NEW: Action to Verify OTP
export async function verifyWhatsAppOtpAction(phoneNumberId, code) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/settings/whatsapp/verify-otp`, {
      method: "POST",
      headers,
      body: JSON.stringify({ phoneNumberId, code })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to verify OTP");
    
    return { success: true };
  } catch (error) {
    console.error("verifyWhatsAppOtpAction Error:", error.message);
    return { success: false, error: error.message };
  }
}