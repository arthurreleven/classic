// Script para rodar UMA VEZ no backend
// Pode criar um arquivo separado: scripts/update-avatars.ts

import mongoose from 'mongoose';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const updateAvatars = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.DATABASE || "mongodb://localhost:27017/test");
    console.log("✅ Conectado ao MongoDB");

    // Buscar usuários sem avatarId
    const usersWithoutAvatar = await User.find({ 
      $or: [
        { avatarId: { $exists: false } },
        { avatarId: null }
      ]
    });

    console.log(`📊 Encontrados ${usersWithoutAvatar.length} usuários sem avatar`);

    // Atualizar cada usuário
    for (const user of usersWithoutAvatar) {
      const randomAvatarId = Math.floor(Math.random() * 12) + 1;
      user.avatarId = randomAvatarId;
      await user.save();
      console.log(`✅ Usuário ${user.email} recebeu avatarId: ${randomAvatarId}`);
    }

    console.log("🎉 Todos os usuários foram atualizados!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Erro ao atualizar avatares:", error);
    process.exit(1);
  }
};

updateAvatars();