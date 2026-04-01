// actions/ads.actions.ts
"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper to get auth headers
async function getAuthHeaders() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session.accessToken}`,
  };
}

// 1. Get the OAuth URL
export async function getAdsAuthUrlAction() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ads/auth-url`, {
      method: "GET",
      headers: await getAuthHeaders(),
      cache: 'no-store'
    });
    const data = await res.json();
    return data.url;
  } catch (error) {
    console.error("Error fetching Ads Auth URL:", error);
    return null;
  }
}

// 2. Fetch Live Campaign Metrics
export async function fetchAdsMetricsAction() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ads/metrics`, {
      method: "GET",
      headers: await getAuthHeaders(),
      cache: 'no-store'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch metrics");
    return data;
  } catch (error) {
    console.error("Error fetching Ads Metrics:", error);
    return null;
  }
}

// 3. Launch the Automated Campaign
export async function launchAdsCampaignAction(payload: { budgetAmount: number, selectedTreatments: string[] }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ads/launch`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return { success: res.ok, ...data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}