import { Request, Response, NextFunction } from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user_email) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  next();
};
