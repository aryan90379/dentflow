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

export async function getCampaignsAction() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/campaigns`, {
      method: "GET",
      headers,
      cache: 'no-store'
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch campaigns");
    
    return data;
  } catch (error: any) {
    console.error("Server Action Error (getCampaignsAction):", error?.message);
    return [];
  }
}

export async function createCampaignAction(payload: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) throw new Error("Unauthorized");
    
    const response = await fetch(`${API_BASE_URL}/api/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(payload), // Send as standard JSON now
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to create campaign");
    
    return { success: true, campaign: data.campaign };
  } catch (error: any) {
    console.error("Server Action Error (createCampaignAction):", error.message);
    return { success: false, error: error.message };
  }
}