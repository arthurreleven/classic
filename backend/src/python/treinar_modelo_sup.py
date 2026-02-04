import re
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

def limpar(t):
    t = t.lower()
    t = re.sub(r"[^a-zA-ZÀ-ÿ0-9 ]", "", t)
    return t.strip()

# -------- DATASET AUMENTADO --------
email = [
    "Não consigo recuperar meu e-mail",
    "Perdi o email da conta",
    "Quero saber qual email está cadastrado",
    "Como faço para recuperar meu e-mail?",
    "Como alterar o email da minha conta?",
    "Não tenho mais acesso ao meu email",
    "Esqueci o email de cadastro",
    "Tem como ver o email da conta?",
    "O email não chega, o que faço?",
    "Meu email foi perdido"
] * 5

senha = [
    "Esqueci minha senha",
    "Não consigo entrar na conta",
    "Quero trocar minha senha",
    "Como recuperar a senha?",
    "Senha incorreta, me ajuda",
    "O link para trocar senha não funciona",
    "Preciso redefinir senha",
    "Não lembro minha senha",
    "Erro de senha",
    "Problema de login"
] * 5

conta = [
    "Quero trocar meu nome de usuário",
    "Como mudar a foto de perfil?",
    "Quero excluir minha conta",
    "Alterar informações da conta",
    "Mudar ícone de usuário",
    "Quero alterar meus dados",
    "Alterar nome da conta",
    "Editar perfil",
    "Apagar minha conta",
    "Quero personalizar meu perfil"
] * 5

jogo = [
    "O jogo está travando",
    "Apareceu erro no jogo",
    "Meu jogo fecha sozinho",
    "Tem um bug no jogo",
    "Estou com lag no jogo",
    "O jogo não abre",
    "Perdi meu progresso no jogo",
    "Erro na partida",
    "Trava quando inicio o jogo",
    "Como reportar bug?"
] * 5

mensagens = [*email, *senha, *conta, *jogo]
rotulos = (
    ["email"] * len(email)
    + ["senha"] * len(senha)
    + ["conta"] * len(conta)
    + ["jogo"] * len(jogo)
)

msgs_limpos = [limpar(m) for m in mensagens]

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(msgs_limpos)

modelo = MultinomialNB()
modelo.fit(X, rotulos)

pickle.dump(modelo, open("modelosup.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizersup.pkl", "wb"))

print("✔ Modelo treinado com sucesso!")
