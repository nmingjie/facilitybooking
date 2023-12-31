import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      userName: string;
      email: string;
      role: string;
      token: string;
    };
  }
}