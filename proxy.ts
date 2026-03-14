import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // You can add extra logic here if needed
  },
  {
    pages: {
      signIn: "/signin", // redirect if user not logged in
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|signin).*)",
  ],
};