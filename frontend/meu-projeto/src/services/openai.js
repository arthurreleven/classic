export async function enviarParaIA(msg) {
  const response = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mensagem: msg }),
  });

  const data = await response.json();
  return data.resposta;
}
