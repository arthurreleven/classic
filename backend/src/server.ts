import app from "./app";
import { connectDB, initCollections } from "./config/db";

const PORT = process.env.PORT || 5000;

connectDB().then((collections) => {
  initCollections(collections);

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
});
