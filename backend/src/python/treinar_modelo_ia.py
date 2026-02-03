import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC

# ----------------------------
# DADOS DE TREINAMENTO
# ----------------------------

perguntas = [
    "como faço uma calculadora",
    "quero criar calculadora",
    "me ajude com uma calculadora",
    "como montar uma calculadora",

    "como treinar uma ia",
    "como funciona aprendizado nao supervisionado",
    "o que é ia na prática",

    "como fazer graficos em python",
    "como usar matplotlib",
    "quero aprender a fazer gráficos",

    "quero fazer um projeto prático",
    "me de uma ideia de projeto",
    "como começar um projeto simples",

    "oi",
    "olá",
    "boa tarde",
    "bom dia",

    "estou com erro",
    "meu código deu erro",
    "como corrigir esse erro"
]

categorias = [
    "calculadora",
    "calculadora",
    "calculadora",
    "calculadora",

    "ia",
    "ia",
    "ia",

    "graficos",
    "graficos",
    "graficos",

    "projeto",
    "projeto",
    "projeto",

    "saudacao",
    "saudacao",
    "saudacao",
    "saudacao",

    "erro",
    "erro",
    "erro"
]

# ----------------------------
# TREINAR O MODELO
# ----------------------------

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(perguntas)

modelo = LinearSVC()
modelo.fit(X, categorias)

# ----------------------------
# SALVAR PICKLES
# ----------------------------

with open("modelolab.pkl", "wb") as f:
    pickle.dump(modelo, f)

with open("vectorizerlab.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("Modelo e vectorizer treinados e salvos com sucesso!")
