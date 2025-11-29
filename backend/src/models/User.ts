import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  passwordHash?: string;
  provider: "google" | "email";
  providerId?: string;
  vitorias?: number;
  derrotas?: number;
  empates?: number;
}

const userSchema = new Schema<IUser>({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  provider: { type: String, required: true },
  providerId: String,
  vitorias: { type: Number, default: 0 },
  derrotas: { type: Number, default: 0 },
  empates: { type: Number, default: 0 },
});

export const User = model<IUser>("User", userSchema);