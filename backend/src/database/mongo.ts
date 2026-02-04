import { MongoClient, ObjectId } from 'mongodb';

const MONGO_URI = process.env.DATABASE || 'mongodb://localhost:27017/test';
let db: any;
let usersCollection: any;

MongoClient.connect(MONGO_URI)
  .then((client) => {
    db = client.db('test');
    usersCollection = db.collection('users');
    console.log('✅ Conectado ao MongoDB');
  })
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));