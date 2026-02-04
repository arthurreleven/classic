import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      nome: string;
      email: string;
      avatar?: string;
    };

    user_id?: string;
    provedor?: "google" | "email";
  }
}

declare global {
  namespace Express {
    interface User {
      nome: string;
      email: string;
      avatar?: string;
      id?: string;
    }
  }
}

export {};