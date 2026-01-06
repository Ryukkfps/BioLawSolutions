import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import pool from "@/lib/db";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const [rows] = await pool.query(
            'SELECT * FROM User WHERE email = ?',
            [credentials.email as string]
          );
          
          const users = rows as any[];
          const user = users[0];

          if (user && user.password === credentials.password) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }

          return null;
        } catch (error) {
          console.error('Auth database error:', error);
          return null;
        }
      },
    }),
  ],
});
