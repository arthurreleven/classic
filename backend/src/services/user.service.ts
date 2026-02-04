import bcrypt from "bcrypt";
import { users } from "../config/db";

export const loginEmailService = async (email: string, password: string) => {
  const user = await users.findOne({ email });

  if (!user) return { error: "Usuário não encontrado" };

<<<<<<< HEAD
  if (!user.senha_hash) return { error: "Usuário sem senha configurada" };

  const valid = await bcrypt.compare(password, user.senha_hash);
  if (!valid) return { error: "Senha incorreta" };

  return { user };
};
=======
  if (!user.passwordHash) return { error: "Usuário sem senha configurada" };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { error: "Senha incorreta" };

  return { user };
};
>>>>>>> 77524ba (Add Files)
