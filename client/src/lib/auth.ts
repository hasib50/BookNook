
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "@/lib/mongodb";

const client = await clientPromise;

const db = client.db(
  process.env.MONGODB_DB_NAME || "booknook"
);

export const auth = betterAuth({
  database: mongodbAdapter(db),

  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  // Email and Password Authentication
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
  },

    // Account Linking
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      // Email verification is not used in this project, so local accounts
      // are never marked verified. Without this, Google can't be linked.
      requireLocalEmailVerified: false,
    },
  },

  // Google OAuth
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  // Trusted Origins
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
});
