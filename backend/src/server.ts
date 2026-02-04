import app from "./app";
<<<<<<< HEAD
import { connectDB, initCollections } from "./config/db";

const PORT = process.env.PORT || 5000;

=======
import mongoose from "mongoose";
import { connectDB, initCollections } from "./config/db";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DATABASE || "mongodb://localhost:27017/test";

// Conectar o Mongoose (para os models usarem)
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Mongoose conectado"))
  .catch(err => {
    console.error("❌ Erro ao conectar Mongoose:", err);
    process.exit(1);
  });

// Conectar o MongoClient nativo (para suas collections existentes)
>>>>>>> 77524ba (Add Files)
connectDB().then((collections) => {
  initCollections(collections);

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> 77524ba (Add Files)
