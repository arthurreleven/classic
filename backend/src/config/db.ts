import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.DATABASE || "mongodb://localhost:27017/test";
export const client = new MongoClient(MONGO_URI);

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("✅ Conectado ao MongoDB");

    const db = client.db("test");

    return {
      db,
      users: db.collection("users"),
      ranking: db.collection("ranking"),
    };

  } catch (err) {
    console.error("❌ Erro ao conectar no MongoDB:");
    console.error(err);
<<<<<<< HEAD
    process.exit(1);  // encerra explicitamente
  }
};


=======
    process.exit(1);
  }
};

>>>>>>> 77524ba (Add Files)
export let users: any;
export let ranking: any;
export let db: any;

<<<<<<< HEAD
// Inicializa quando o server.ts chamar
=======
>>>>>>> 77524ba (Add Files)
export const initCollections = (collections: any) => {
  db = collections.db;
  users = collections.users;
  ranking = collections.ranking;
<<<<<<< HEAD
};
=======
};
>>>>>>> 77524ba (Add Files)
