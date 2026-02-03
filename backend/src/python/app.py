from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re
import os

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------
# 1. VARIÁVEIS GLOBAIS
# ---------------------------------------------------------
modelo_suporte = None
vectorizer_suporte = None
modelo_lab = None
vectorizer_lab = None

# ---------------------------------------------------------
# 2. CARREGAMENTO DOS MODELOS
# ---------------------------------------------------------
def carregar_modelos():
    global modelo_suporte, vectorizer_suporte, modelo_lab, vectorizer_lab
    
    # --- Carregar Suporte ---
    try:
        with open("modelosup.pkl", "rb") as f:
            modelo_suporte = pickle.load(f)
        with open("vectorizersup.pkl", "rb") as f:
            vectorizer_suporte = pickle.load(f)
        print("✅ [SUPORTE] Modelos carregados com sucesso!")
    except Exception as e:
        print(f"⚠️ [SUPORTE] Aviso (Rodando sem ML): {e}")

    # --- Carregar Lab IA ---
    try:
        with open("modelolab.pkl", "rb") as f:
            modelo_lab = pickle.load(f)
        with open("vectorizerlab.pkl", "rb") as f:
            vectorizer_lab = pickle.load(f)
        print("✅ [LAB IA] Modelos carregados com sucesso!")
    except Exception as e:
        print(f"⚠️ [LAB IA] Aviso (Rodando sem ML): {e}")

carregar_modelos()

# ---------------------------------------------------------
# 3. FUNÇÕES AUXILIARES
# ---------------------------------------------------------
def limpar_texto(texto):
    if not isinstance(texto, str): return ""
    texto = texto.lower()
    texto = re.sub(r'[^\w\s]', '', texto)
    return texto.strip()

respostas_suporte = {
    "email": "Para recuperar seu e-mail, acesse Minha Conta > Recuperar.",
    "senha": "Clique em 'Esqueci minha senha' na tela de login.",
    "cadastro": "O cadastro é gratuito. Clique em Registrar-se.",
    "erro": "Tente reiniciar a página. Se persistir, contate o admin.",
    "saudacao": "Olá! Sou a IA de suporte. Como posso ajudar?",
}

# ---------------------------------------------------------
# ROTA 1: CHATBOT DE SUPORTE
# ---------------------------------------------------------
@app.route("/predict-suporte", methods=["POST"])
def predict_suporte():
    data = request.get_json()
    mensagem = data.get("mensagem", "").lower()
    
    # --- PASSO 1: Regras Manuais ---
    
    if any(w in mensagem for w in ['oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'ajuda']):
        return jsonify({"resposta": "Olá! Sou o assistente virtual. Posso ajudar com: Senha, E-mail, Conta ou problemas no Jogo.", "categoria": "saudacao", "confidence": 1.0})

    if any(w in mensagem for w in ['email', 'e-mail', 'correio', 'gmail', 'hotmail']):
        return jsonify({"resposta": "Para recuperar ou alterar seu e-mail, acesse: Configurações > Minha Conta > Dados de Contato.", "categoria": "email", "confidence": 1.0})

    if any(w in mensagem for w in ['senha', 'password', 'esqueci', 'recuperar']):
        return jsonify({"resposta": "Esqueceu a senha? Não se preocupe! Clique em 'Esqueci minha senha' na tela de login.", "categoria": "senha", "confidence": 1.0})

    if any(w in mensagem for w in ['conta', 'usuario', 'usuário', 'login', 'nome', 'nick']):
        return jsonify({"resposta": "Para alterar seu nome de usuário ou dados da conta, vá até o seu Perfil e clique no ícone de lápis.", "categoria": "conta", "confidence": 1.0})

    # Adicionei 'leg', 'travou' aqui para ficar mais esperto
    if any(w in mensagem for w in ['jogo', 'game', 'travando', 'travou', 'lag', 'lento', 'bug']):
        return jsonify({"resposta": "Se o jogo está travando, verifique sua conexão de internet e limpe o cache!", "categoria": "jogo", "confidence": 1.0})

    # --- PASSO 2: Modelo ML ---
    if modelo_suporte and vectorizer_suporte:
        try:
            vetor = vectorizer_suporte.transform([limpar_texto(mensagem)])
            categoria_predita = modelo_suporte.predict(vetor)[0]
            confidence = float(max(modelo_suporte.predict_proba(vetor)[0])) if hasattr(modelo_suporte, "predict_proba") else 1.0

            if confidence > 0.45:
                return jsonify({
                    "resposta": respostas_suporte.get(categoria_predita, "Hmm, sei a categoria mas não tenho a frase exata."),
                    "categoria": categoria_predita,
                    "confidence": round(confidence, 2),
                    "origem": "IA ML"
                })
        except:
            pass

    # --- PASSO 3: Fallback ---
    return jsonify({
        "resposta": "Desculpe, não entendi. Tente clicar nos botões ou digite 'senha', 'email'.",
        "categoria": "desconhecido",
        "confidence": 0.0
    })

# ---------------------------------------------------------
# ROTA 2: LABORATÓRIO DE IA
# ---------------------------------------------------------
@app.route("/predict-lab", methods=["POST"])
def predict_lab():
    data = request.get_json()
    texto_entrada = data.get("mensagem", data.get("texto_analise", "")).lower()

    if not texto_entrada:
        return jsonify({"erro": "Texto não enviado."}), 400

    # --- PASSO 1: Regras Manuais ---
    if any(word in texto_entrada for word in ['calculadora', 'soma', 'somar', 'matematica']):
        return jsonify({"categoria": "calculadora", "origem": "Regra Manual"})
    
    if any(word in texto_entrada for word in ['ia', 'inteligencia', 'kmeans', 'aprendizado']):
        return jsonify({"categoria": "ia", "origem": "Regra Manual"})
    
    if any(word in texto_entrada for word in ['grafico', 'plot', 'chart', 'visualizacao']):
        return jsonify({"categoria": "graficos", "origem": "Regra Manual"})
    
    if any(word in texto_entrada for word in ['projeto', 'tarefa', 'lista', 'json']):
        return jsonify({"categoria": "projeto", "origem": "Regra Manual"})

    # --- PASSO 2: Modelo ML ---
    if modelo_lab and vectorizer_lab:
        try:
            vetor = vectorizer_lab.transform([limpar_texto(texto_entrada)])
            resultado = modelo_lab.predict(vetor)[0]
            return jsonify({
                "resposta": f"Analisei seu texto com ML e classifiquei como: {resultado}",
                "resultado_analise": resultado,
                "origem": "Modelo ML"
            })
        except:
            pass

    # --- PASSO 3: Fallback ---
    return jsonify({
        "resposta": "Não entendi. Tente pedir: 'calculadora', 'exemplo de IA' ou 'gráficos'.",
        "origem": "Fallback"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)