from flask import Flask, request, jsonify, redirect, url_for, render_template, session
from flask_dance.contrib.google import make_google_blueprint, google
from flask_dance.consumer import oauth_authorized
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os

# Carrega variáveis do .env
load_dotenv()

app = Flask(__name__)
app.secret_key = "1234SDD"

app.config["SESSION_COOKIE_NAME"] = "google-login-session"
app.config["SESSION_PERMANENT"] = False

# Google OAuth (permitir http local)
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
google_bp = make_google_blueprint(
    client_id = os.getenv("GOOGLE_CLIENT_ID"),
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET"),
    scope=[
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
    ],
    redirect_to="login"
)
app.register_blueprint(google_bp, url_prefix="/login")

# Conexão com MongoDB
MONGO_URI = os.getenv("DATABASE")
client = MongoClient(MONGO_URI)
db = client["test"]
users = db["users"]

# ---------------- Rotas ---------------- #

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login")
def login():
    if not google.authorized:
        return redirect(url_for("google.login"))

    resp = google.get("/oauth2/v2/userinfo")  # corrigido
    info = resp.json()
    email = info["email"]
    nome = info.get("name", "")

    # Cria usuário se não existir
    if not users.find_one({"email": email}):
        users.insert_one({
            "email": email,
            "nome": nome,
            "vitorias": 0,
            "derrotas": 0,
            "empates": 0
        })

    # Sessão deve ser criada fora do if
    session["user_email"] = email
    return redirect(url_for("jogo"))

@app.route("/jogo")
def jogo():
    if "user_email" not in session:
        return redirect(url_for("login"))
    return render_template("jogo.html")

@app.route("/resultado/<resultado>")
def resultado(resultado):
    email = session.get("user_email")
    if not email:
        return redirect(url_for("login"))

    if resultado == "vitoria":
        users.update_one({"email": email}, {"$inc": {"vitorias": 1}})
    elif resultado == "derrota":
        users.update_one({"email": email}, {"$inc": {"derrotas": 1}})
    elif resultado == "empate":
        users.update_one({"email": email}, {"$inc": {"empates": 1}})

    stats = users.find_one({"email": email}, {"_id": 0})
    return render_template("resultado.html", stats=stats)

# ---------------- API extra ---------------- #

@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    if not data or 'name' not in data or 'email' not in data:
        return jsonify({"error": "Por favor, envie nome e email"}), 400

    result = users.insert_one({
        "name": data["name"],
        "email": data["email"]
    })

    return jsonify({"Message": "Usuário inserido", "id": str(result.inserted_id)}), 200

@app.route('/users', methods=['GET'])
def get_users():
    name = request.args.get('name')
    query = {}

    if name:
        query['name'] = {'$regex': name, '$options': 'i'}

    user_list = list(users.find(query))
    for user in user_list:
        user['_id'] = str(user['_id'])

    return jsonify(user_list)

@app.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    result = users.delete_one({'_id': ObjectId(user_id)})

    if result.deleted_count == 1:
        return jsonify({"message": "Usuário deletado com sucesso"}), 200
    else:
        return jsonify({"error": "Não foi possível deletar o usuário"}), 400

# ------------------------------------------- #

@oauth_authorized.connect_via(google_bp)
def google_logged_in(blueprint, token):
    if not token:
        return False  # bloqueia login se o token falhar
    return True


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))


@app.route("/ranking")
def ranking():
    top = list(users.find({}, {"_id": 0}).sort("vitorias", -1))
    return render_template("ranking.html", jogadores=top)

if __name__ == "__main__":
    app.run(debug=True)
