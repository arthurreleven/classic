import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import path from 'path';
import dotenv from 'dotenv';
import chatRoutes from "./routes/chat";
import cors from 'cors';
import { setupSwagger } from './config/swagger';

// Carrega variáveis de ambiente
dotenv.config();

// Interfaces
interface User {
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
}

// Configuração do Express
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(express.json());

setupSwagger(app);

app.use(express.static(path.join(__dirname, '../../frontend')));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Configuração de sessão
app.use(
  session({
    secret: process.env.SECRET_KEY || 'devkey',
    name: 'google-login-session',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());

// Conexão com MongoDB
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

// Configuração do Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/login/google/authorized',
      scope: ['email', 'profile'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const nome = profile.displayName;

        if (!email) {
          return done(new Error('Email não encontrado'), undefined);
        }

        // Verifica se usuário existe
        let user = await usersCollection.findOne({ email });

        // Cria usuário se não existir
        if (!user) {
          await usersCollection.insertOne({
            email,
            nome,
            vitorias: 0,
            derrotas: 0,
            empates: 0,
            provedor: 'google',
            provedor_id: profile.id,
          });
          user = await usersCollection.findOne({ email });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email: string, done) => {
  try {
    const user = await usersCollection.findOne({ email });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Middleware de autenticação
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user_email) {
    return res.redirect('/');
  }
  next();
};

// ---------------- Rotas HTML estático ---------------- //
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/meu-projeto/public/index.html'));
});

app.get('/jogo', requireAuth, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/meu-projeto/public/jogos/jogo_da_velha/index.html'));
});

app.get('/resultado', requireAuth, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/meu-projeto/public/resultado/index.html'));
});

app.get('/ranking', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/meu-projeto/public/ranking/index.html'));
});

// ---------------- Rotas de Autenticação ---------------- //
app.get('/api/login', passport.authenticate('google'));

app.get(
  '/login/google/authorized',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response) => {
    const user = req.user as User;
    req.session.user_email = user.email;
    req.session.user_name = user.nome || user.name || '';
    req.session.provedor = 'google';
    res.redirect(FRONTEND_URL);
  }
);

app.get('/api/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
    res.json({ message: 'Logout realizado' });
  });
});

app.post('/api/login_email', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (!user.senha_hash) {
      return res.status(400).json({ error: 'Usuário não possui senha configurada' });
    }

    const isValidPassword = await bcrypt.compare(password, user.senha_hash);

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    req.session.user_email = user.email;
    req.session.user_name = user.name || user.nome || '';
    req.session.user_id = user._id.toString();
    req.session.provedor = 'email';

    res.json({ message: 'Login realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

// ---------------- Rotas de API ---------------- //
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const email = req.session.user_email;

    if (!email) {
      return res.status(401).json({ error: 'Usuário não logado' });
    }

    const stats = await usersCollection.findOne(
      { email },
      { projection: { _id: 0 } }
    );

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

app.get('/api/ranking', async (req: Request, res: Response) => {
  try {
    const top = await usersCollection
      .find({}, { projection: { _id: 0 } })
      .sort({ vitorias: -1 })
      .toArray();

    res.json(top);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
});

app.post('/api/resultado/:resultado', async (req: Request, res: Response) => {
  try {
    const email = req.session.user_email;
    const nome = req.session.user_name || 'Anônimo';
    const resultado = req.params.resultado as string;

    if (!email) {
      return res.status(401).json({ error: 'Usuário não logado' });
    }

    if (!['vitoria', 'derrota', 'empate'].includes(resultado)) {
      return res.status(400).json({ error: 'Resultado inválido' });
    }

    // Atualiza estatísticas do usuário
    const updateField = `${resultado}s`;
    await usersCollection.updateOne(
      { email },
      { $inc: { [updateField]: 1 } }
    );

    // Se for vitória, adiciona pontos no ranking
    if (resultado === 'vitoria') {
      const rankingCollection = db.collection('ranking');
      await rankingCollection.updateOne(
        { jogo: 'Jogo da Velha' },
        {
          $push: {
            'dificuldades.facil': {
              nome,
              email,
              pontuacao: 5,
              data: new Date().toISOString(),
            },
          },
        },
        { upsert: true }
      );
    }

    const stats = await usersCollection.findOne(
      { email },
      { projection: { _id: 0 } }
    );

    res.json({ message: 'Resultado registrado com sucesso', stats });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar resultado' });
  }
});

// ---------------- Rotas de Gerenciamento de Usuários ---------------- //
app.post('/api/resultado/:resultado', async (req: Request, res: Response) => {
  try {
    const email = req.session.user_email;
    const nome = req.session.user_name || 'Anônimo';
    const resultado = req.params.resultado as string;
    const { dificuldade } = req.body; // <= dificuldade recebida no POST

    if (!email) {
      return res.status(401).json({ error: 'Usuário não logado' });
    }

    if (!['vitoria', 'derrota', 'empate'].includes(resultado)) {
      return res.status(400).json({ error: 'Resultado inválido' });
    }

    if (!['facil', 'medio', 'dificil'].includes(dificuldade)) {
      return res.status(400).json({ error: 'Dificuldade inválida' });
    }

    // Incrementa estatísticas
    const updateField = `${resultado}s`;
    await usersCollection.updateOne(
      { email },
      { $inc: { [updateField]: 1 } }
    );

    // Se for vitória, insere no ranking
    if (resultado === 'vitoria') {
      const rankingCollection = db.collection('ranking');

      await rankingCollection.updateOne(
        { jogo: 'Jogo da Velha' },
        {
          $push: {
            [`dificuldades.${dificuldade}`]: {
              nome,
              email,
              pontuacao: 5,
              data: new Date().toISOString(),
            }
          }
        },
        { upsert: true }
      );
    }

    const stats = await usersCollection.findOne(
      { email },
      { projection: { _id: 0 } }
    );

    res.json({ message: 'Resultado registrado com sucesso', stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar resultado' });
  }
});

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    const query: any = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const userList = await usersCollection.find(query).toArray();

    const formattedUsers = userList.map((user: any) => ({
      ...user,
      _id: user._id.toString(),
    }));

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

app.delete('/api/users/:user_id', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(user_id),
    });

    if (result.deletedCount === 1) {
      res.json({ message: 'Usuário deletado com sucesso' });
    } else {
      res.status(400).json({ error: 'Não foi possível deletar o usuário' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

app.get('/api/jogos', async (req: Request, res: Response) => {
  try {
    const rankingCollection = db.collection('ranking');

    const jogos = await rankingCollection
      .find({}, { projection: { _id: 1, jogo: 1 } })
      .toArray();

    res.json(jogos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar jogos' });
  }
});

app.get("/api/ranking_nome/:jogo/:dificuldade", async (req, res) => {
  try {
    const { jogo, dificuldade } = req.params;

    const rankingCollection = db.collection("ranking");

    const doc = await rankingCollection.findOne({ jogo });

    if (!doc) {
      return res.json([]);
    }

    if (!doc.dificuldades || !doc.dificuldades[dificuldade]) {
      return res.json([]);
    }

    const dados = [...doc.dificuldades[dificuldade]]
      .sort((a, b) => (b.pontuacao ?? 0) - (a.pontuacao ?? 0));

    res.json(dados);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar ranking" });
  }
});


/**
 * @swagger
 * /api/ranking_nome/{jogo}/{dificuldade}:
 *   get:
 *     summary: Retorna o ranking de um jogo por dificuldade
 *     tags: [Ranking]
 *     parameters:
 *       - in: path
 *         name: jogo
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do jogo
 *       - in: path
 *         name: dificuldade
 *         required: true
 *         schema:
 *           type: string
 *           enum: [facil, medio, dificil]
 *         description: Dificuldade do jogo
 *     responses:
 *       200:
 *         description: Lista de jogadores ordenados por pontuação
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nome:
 *                     type: string
 *                   email:
 *                     type: string
 *                   pontuacao:
 *                     type: number
 */

app.use("/api", chatRoutes)

// Inicialização do servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});