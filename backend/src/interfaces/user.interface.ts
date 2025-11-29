import { MongoClient, ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  name?: string;
  nome?: string;
  vitorias?: number;
  derrotas?: number;
  empates?: number;
  provedor: 'google' | 'email';
  provedor_id?: string;
  senha_hash?: string;
};