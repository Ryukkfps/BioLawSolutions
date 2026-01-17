import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
    signOut: "/admin/login",
  },
  trustHost: true,
  useSecureCookies: false, // Set to true if using HTTPS
  secret: process.env.AUTH_SECRET || "any-random-secret-for-development",
  events: {
    async signOut() {
      // This runs on the server side when sign out occurs
      console.log("User signed out");
    },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl, method, headers } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginRoute = nextUrl.pathname === "/admin/login";

      if (isAdminRoute && !isLoginRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isLoginRoute && isLoggedIn) {
        // Get the actual host from headers to avoid 0.0.0.0
        const host = headers.get('host') || '';
        const referer = headers.get('referer');
        
        let redirectHost = host;
        if (host.startsWith('0.0.0.0') && referer) {
          try {
            const refererUrl = new URL(referer);
            redirectHost = refererUrl.host;
          } catch (e) {
            // Use NEXTAUTH_URL if available
            if (process.env.NEXTAUTH_URL) {
              const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
              redirectHost = nextAuthUrl.host;
            }
          }
        }
        
        const protocol = nextUrl.protocol;
        return Response.redirect(new URL(`${protocol}//${redirectHost}/admin`));
      }

      // Basic protection for API routes that modify data
      // Allow public access to appointment and reviews API
      const publicApiRoutes = ["/api/appointment", "/api/reviews", "/api/enquiry"];
      const isPublicApi = publicApiRoutes.some(route => nextUrl.pathname.startsWith(route));

      if (nextUrl.pathname.startsWith("/api/") && 
          !nextUrl.pathname.startsWith("/api/auth") && 
          !isPublicApi &&
          method !== "GET" && 
          !isLoggedIn) {
        return false;
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Handle relative URLs
      if (url.startsWith("/")) {
        return url;
      }
      
      // Parse the URL to check if it's using 0.0.0.0
      try {
        const urlObj = new URL(url);
        
        // If the URL contains 0.0.0.0, replace it with NEXTAUTH_URL or baseUrl
        if (urlObj.hostname === "0.0.0.0") {
          if (process.env.NEXTAUTH_URL) {
            const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
            urlObj.hostname = nextAuthUrl.hostname;
            urlObj.port = nextAuthUrl.port;
            urlObj.protocol = nextAuthUrl.protocol;
            return urlObj.toString();
          }
        }
        
        // If URL is on the same origin, allow it
        if (urlObj.origin === baseUrl) {
          return url;
        }
        
        // If URL starts with baseUrl, allow it
        if (url.startsWith(baseUrl)) {
          return url;
        }
      } catch (error) {
        console.error("Error parsing redirect URL:", error);
      }
      
      // Default to baseUrl for safety
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // Add providers with empty array for middleware
} satisfies NextAuthConfig;
