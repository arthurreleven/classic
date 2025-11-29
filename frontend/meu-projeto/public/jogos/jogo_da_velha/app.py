import math
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- Função para verificar o vencedor ---
def verificar_vencedor(tabuleiro):
    combinacoes_vitoria = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for a, b, c in combinacoes_vitoria:
        if tabuleiro[a] == tabuleiro[b] == tabuleiro[c] and tabuleiro[a] != "":
            return tabuleiro[a]

    if "" not in tabuleiro:
        return "empate"

    return None


# --- Função Minimax (nível difícil) ---
def minimax(tabuleiro, profundidade, is_maximizando):
    vencedor = verificar_vencedor(tabuleiro)

    if vencedor == "O":  # IA vence
        return 1
    elif vencedor == "X":  # Jogador vence
        return -1
    elif vencedor == "empate":
        return 0

    if is_maximizando:
        melhor_pontuacao = -math.inf
        for i in range(9):
            if tabuleiro[i] == "":
                tabuleiro[i] = "O"
                pontuacao = minimax(tabuleiro, profundidade + 1, False)
                tabuleiro[i] = ""
                melhor_pontuacao = max(pontuacao, melhor_pontuacao)
        return melhor_pontuacao
    else:
        melhor_pontuacao = math.inf
        for i in range(9):
            if tabuleiro[i] == "":
                tabuleiro[i] = "X"
                pontuacao = minimax(tabuleiro, profundidade + 1, True)
                tabuleiro[i] = ""
                melhor_pontuacao = min(pontuacao, melhor_pontuacao)
        return melhor_pontuacao


# --- IA escolhe melhor jogada (nível difícil) ---
def melhor_jogada(tabuleiro):
    melhor_pontuacao = -math.inf
    movimento = None

    for i in range(9):
        if tabuleiro[i] == "":
            tabuleiro[i] = "O"
            pontuacao = minimax(tabuleiro, 0, False)
            tabuleiro[i] = ""
            if pontuacao > melhor_pontuacao:
                melhor_pontuacao = pontuacao
                movimento = i
    return movimento


# --- IA com base no nível ---
def jogada_por_nivel(tabuleiro, nivel):
    posicoes_vazias = [i for i, v in enumerate(tabuleiro) if v == ""]

    if not posicoes_vazias:
        return None

    # Nível fácil → 100% aleatório
    if nivel == "facil":
        return random.choice(posicoes_vazias)

    # Nível médio → 50% chance de jogar aleatório, 50% de jogar bem
    elif nivel == "medio":
        if random.random() < 0.5:
            return random.choice(posicoes_vazias)
        else:
            return melhor_jogada(tabuleiro)

    # Nível difícil → sempre melhor jogada
    else:
        return melhor_jogada(tabuleiro)


# --- Rota principal da IA ---
@app.route("/jogada_ia", methods=["POST"])
def jogada_ia():
    dados = request.json
    tabuleiro = dados.get("tabuleiro", [])
    nivel = dados.get("nivel", "dificil")  # padrão: difícil

    posicao_escolhida = jogada_por_nivel(tabuleiro, nivel)

    return jsonify({"posicao": posicao_escolhida})


if __name__ == "__main__":
    app.run(debug=True)
