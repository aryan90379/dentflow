import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// ⚠️ Make sure this points to your LOCAL Express server if you are testing locally!
// e.g., process.env.NEXT_PUBLIC_API_URL="http://localhost:4080" in your .env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.instasnap.tech";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      // ⚠️ 'account' is ONLY available on the very first sign-in
      if (account && account.id_token) {
        try {
          console.log("🚀 Sending token to Express backend at:", `${API_BASE_URL}/api/auth/google`);
          
          const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: account.id_token }),
          });

          const data = await res.json();
          console.log("📦 Express Backend Response:", data);

          if (res.ok && data.success) {
            // Success! Store the custom Express JWT in the NextAuth token
            token.accessToken = data.token; 
            token.backendUser = data.user;
          } else {
            console.error("❌ Express Auth Failed:", data);
            // 🔥 This forcefully stops NextAuth from logging the user in
            throw new Error(data.error || "Express backend rejected the login"); 
          }
        } catch (error) {
          console.error("❌ Express Server Connection Error:", error);
          // 🔥 This stops the login if the Express server is offline
          throw new Error("Could not connect to Express backend"); 
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Transfer the Express token from the JWT to the readable session
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (token.backendUser) {
        session.user = { ...session.user, ...token.backendUser };
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/signin", // Redirects back to sign in if the Express backend fails
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };