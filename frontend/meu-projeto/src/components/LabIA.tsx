import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Definição do tipo da mensagem
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const LabIA: React.FC = () => {
  // === ESTADOS DO REACT (A forma correta de guardar dados) ===
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Olá! 👋 Antes de começarmos, qual é o seu nome?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [waitingName, setWaitingName] = useState(true); // Começa esperando o nome se quiser, ou false
  const [userName, setUserName] = useState<string | null>(null);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Referências para scroll
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Respostas prontas
  const fullResponses: Record<string, (name: string) => string> = {
    calculadora: (name) => `
    ${name}, aqui está *uma calculadora completa em Python*, usando if/else e funções:
    \`\`\`python
    def soma(a, b):
        return a + b

    def subtrai(a, b):
        return a - b

    def multiplica(a, b):
        return a * b

    def divide(a, b):
        if b == 0:
            return "Erro: divisão por zero"
        return a / b

    def menu():
        print("=== Calculadora ===")
        print("1 - Soma")
        print("2 - Subtração")
        print("3 - Multiplicação")
        print("4 - Divisão")

    if __name__ == "__main__":
        menu()
        op = input("Escolha: ")

        a = float(input("Valor A: "))
        b = float(input("Valor B: "))

        if op == "1":
            print("Resultado:", soma(a,b))
        elif op == "2":
            print("Resultado:", subtrai(a,b))
        elif op == "3":
            print("Resultado:", multiplica(a,b))
        elif op == "4":
            print("Resultado:", divide(a,b))
        else:
            print("Opção inválida")
    \`\`\`

    Para rodar:
    \`\`\`
    python calculadora.py
    \`\`\`
    `,

        ia: (name) => `
    Beleza ${name}! Aqui vai um *exemplo completo* de aprendizado **não supervisionado** (KMeans):

    \`\`\`python
    from sklearn.datasets import make_blobs
    from sklearn.cluster import KMeans
    import matplotlib.pyplot as plt

    # Gerar dados
    X, y = make_blobs(n_samples=300, centers=3, random_state=42)

    # Modelo não supervisionado
    kmeans = KMeans(n_clusters=3, random_state=42)
    kmeans.fit(X)

    # Resultados
    labels = kmeans.labels_
    centers = kmeans.cluster_centers_

    # Visualização
    plt.scatter(X[:,0], X[:,1], c=labels)
    plt.scatter(centers[:,0], centers[:,1], s=200, marker="X", color="red")
    plt.title("Clusters encontrados pelo KMeans")
    plt.show()
    \`\`\`
    `,

        graficos: (name) => `
    Aqui está, ${name}! Um pacote completo de **gráficos Python** com Matplotlib:

    \`\`\`python
    import matplotlib.pyplot as plt

    # Gráfico de linha
    x = [1, 2, 3, 4]
    y = [10, 20, 25, 40]
    plt.plot(x, y, marker="o")
    plt.title("Gráfico de Linha")
    plt.show()

    # Gráfico de barras
    plt.bar(["A", "B", "C"], [12, 19, 7])
    plt.title("Gráfico de Barras")
    plt.show()

    # Gráfico de dispersão
    import random
    pts_x = [random.random() for _ in range(50)]
    pts_y = [random.random() for _ in range(50)]
    plt.scatter(pts_x, pts_y)
    plt.title("Scatter Plot")
    plt.show()
    \`\`\`
    `,

        projeto: (name) => `
    Perfeito ${name}! Aqui está um *mini projeto Python* completo (lista de tarefas):

    \`\`\`python
    import json

    tasks = []

    def add_task(t):
        tasks.append(t)

    def save():
        with open("data.json","w") as f:
            json.dump(tasks, f)

    def load():
        try:
            with open("data.json") as f:
                return json.load(f)
        except:
            return []

    # Programa principal
    while True:
        print("1 - Adicionar tarefa")
        print("2 - Listar tarefas")
        print("3 - Salvar")
        print("4 - Carregar")
        print("0 - Sair")

        op = input("> ")

        if op == "1":
            tarefa = input("Tarefa: ")
            add_task(tarefa)
        elif op == "2":
            print(tasks)
        elif op == "3":
            save()
        elif op == "4":
            tasks = load()
        elif op == "0":
            break
    \`\`\`
    `
  };

  // Função auxiliar para renderizar texto com blocos de código
  const renderContent = (text: string | null | undefined) => { // Aceita null/undefined
    // 1. SEGURANÇA: Se não tiver texto, não faz nada (evita tela cinza)
    if (!text) return null;

    // Se não tiver código, retorna texto simples
    if (!text.includes("```")) {
      return <span className="whitespace-pre-wrap">{text}</span>;
    }

    // Divide o texto onde tem ```
    const parts = text.split("```");

    return parts.map((part, index) => {
      if (index % 2 !== 0) {
        const cleanCode = part.replace(/^python\n/, "").replace(/^\n/, "");
        return (
          <div key={index} className="my-2 bg-[#0d1117] p-3 rounded-md border border-gray-700 overflow-x-auto">
            <code className="font-mono text-xs text-emerald-400 block whitespace-pre">
              {cleanCode}
            </code>
          </div>
        );
      }
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  // === EFEITOS ===

  // 1. Scroll automático sempre que chegar mensagem nova
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 2. Animação Scroll Reveal (Mantido do seu original)
  useEffect(() => {
    function reveal() {
      document.querySelectorAll('.fade-up').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight - 60) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }
    window.addEventListener('scroll', reveal);
    reveal();
    return () => window.removeEventListener('scroll', reveal);
  }, []);

  // === FUNÇÕES DE LÓGICA ===

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
  };

  // Função disparada ao clicar nos botões de categoria
  const handleCategoryClick = (category: string) => {
    // Se já temos o nome, mostra o conteúdo direto
    if (userName) {
        addMessage(`Quero ver sobre: ${category}`, 'user');
        setTimeout(() => {
            if (fullResponses[category]) {
                addMessage(fullResponses[category](userName), 'bot');
            }
        }, 500);
    } else {
        // Se NÃO temos o nome, guarda a categoria e pede o nome
        setPendingCategory(category);
        setWaitingName(true);
        addMessage(`Quero ver sobre ${category}.`, 'user'); 
        
        setTimeout(() => {
            addMessage("Antes de eu te mostrar o conteúdo completo, qual é o seu nome?", 'bot');
        }, 600);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const text = inputValue.trim();
    addMessage(text, 'user');
    setInputValue("");
    setIsTyping(true);

    // LÓGICA 1: Captura de Nome (Roda apenas no frontend)
    if (waitingName) {
      setTimeout(() => {
        setIsTyping(false);
        setUserName(text);
        setWaitingName(false);

        // Se tinha uma categoria pendente
        if (pendingCategory && fullResponses[pendingCategory]) {
          addMessage(fullResponses[pendingCategory](text), 'bot');
          setPendingCategory(null);
        } else {
          addMessage(`Prazer, ${text}! Como posso ajudar hoje?`, 'bot');
        }
      }, 600);
      return;
    }

    // LÓGICA 2: Chamada ao Backend Python (API)
    try {
      // Tenta conectar com o Python
      const response = await fetch("http://127.0.0.1:5000/predict-lab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mensagem: text }),
      });

      if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.status}`);
      }

      const data = await response.json();
      setIsTyping(false);

      const nomeParaUso = userName || "Visitante";

      // === LÓGICA UNIFICADA (CORRIGIDA) ===
      
      // 1. Verifica se veio erro explícito do Python
      if (data.erro) {
        addMessage(`Erro da IA: ${data.erro}`, 'bot');
        return;
      }

      // 2. Prioridade: Categoria Rica (Calculadora, IA, Gráficos)
      if (data.categoria && fullResponses[data.categoria]) {
        addMessage(fullResponses[data.categoria](nomeParaUso), 'bot');
      } 
      // 3. Fallback: Resposta de texto simples vinda da IA
      else if (data.resposta) {
        addMessage(data.resposta, 'bot');
      } 
      // 4. Segurança: Se o JSON veio vazio ou estranho
      else {
        addMessage("Não entendi. Poderia reformular?", 'bot');
      }

    } catch (error) {
      setIsTyping(false);
      console.error("Erro na API:", error);
      // Mensagem amigável de erro
      addMessage("Ops! O servidor Python parece estar desligado. Verifique o terminal.", 'bot');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="w-screen min-h-screen bg-[#040826] text-white font-bangers relative overflow-x-hidden">
      {/* Fonts */}
      <link href="[https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap](https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap)" rel="stylesheet" />
      
      {/* Keyframes customizados (Tailwind config é melhor, mas style funciona para casos pontuais) */}
      <style>{`
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
        }
        .animate-float {
            animation: float 4s ease-in-out infinite;
        }
        /* Utilitário para ocultar barra de rolagem se necessário */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* HEADER */}
      <header className="w-full bg-[#00020D] relative z-10">
        <div className="w-full px-6 py-4 flex items-center">
          <div className="flex items-center gap-4 mr-20 ml-6">
            <Link to="/" className="w-35 h-18 flex items-center justify-center cursor-pointer">
              <img src="/images/images-login/logo-projeto.png" alt="Logo" className="w-full h-full object-contain" />
            </Link>
          </div>

          <nav className="ml-20 flex items-center gap-12 text-3xl">
            <Link to="/" className="cursor-pointer hover:text-orange-400 transition">Jogos</Link>
            <Link to="/conta" className="cursor-pointer hover:text-orange-400 transition">Conta</Link>
            <Link to="/sobre" className="cursor-pointer text-orange-400">Sobre</Link>
            <Link to="/suporte" className="cursor-pointer text-orange-400">Suporte</Link>
            <Link to="/ranking" className="hover:text-orange-400 transition">Ranking</Link>
            <Link to="/labia" className="hover:text-orange-400 transition">IA</Link>
          </nav>

          <div className="ml-auto mr-6">
            <button
              onClick={() => (window.location.href = "/login/login.html")}
              className="px-6 py-2 bg-orange-500 text-white text-2xl
              rounded-xl border-[4px] border-black shadow-[3px_3px_0px_#000]
              hover:translate-y-[-2px] transition-all active:translate-y-[1px]"
            >
              Entrar
            </button>
          </div>
        </div>

        <div className="h-1 w-full border-t-4 border-orange-500"></div>
      </header>

      <div className="max-w-[1100px] mx-auto px-6 py-10">
        {/* HERO */}
        <header className="flex flex-col md:flex-row items-center gap-8 p-6 md:p-12 rounded-2xl bg-gradient-to-r from-[rgba(13,18,28,0.6)] to-[rgba(7,10,18,0.2)] shadow-[0_6px_24px_rgb(18,40,138)] mb-8 mt-5">
          <div className="flex-1">
            <div className="inline-block py-1.5 px-2.5 rounded-full bg-[rgba(93,224,255,0.08)] text-[#5de0ff] font-bold text-[13px] mb-4">
              Projeto — IA Jogando
            </div>
            <h1 className="m-0 mb-3 text-[clamp(28px,4.2vw,48px)] tracking-tight leading-[1.03] font-bold text-white">
              Por que a Inteligência Artificial existe?
            </h1>

            <p className="text-[#a7b1c2] m-0 mb-[18px] text-[15px] leading-relaxed">
              A inteligência artificial nasceu da vontade de estender o pensamento humano.
              <br /><br />
              O interesse em criar máquinas capazes de simular o pensamento humano se intensificou a partir da segunda metade do século XX, quando áreas como psicologia, ciência cognitiva, computação e robótica passaram a estudar a inteligência artificial (IA). A motivação era desenvolver sistemas capazes de analisar problemas, tomar decisões e automatizar tarefas do cotidiano.
              <br /><br />
              Apesar de ser um campo moderno, o conceito não é novo: ainda na Antiguidade, Aristóteles imaginava ferramentas autônomas substituindo a mão de obra escrava — visão que antecipava as bases da IA muito antes da tecnologia existir.
              <br /><br />
              Turing, em seu artigo “Computing Machinery and Intelligence”, questionou se máquinas poderiam pensar a ponto de imitar o comportamento humano e enganar até mesmo um avaliador. Os primeiros testes em IA já impressionavam, mesmo limitados pelo desempenho dos computadores da época.
            </p>

            <div className="flex gap-3 flex-wrap">
              <button id="jumpToVideo" className="bg-gradient-to-b from-[#5de0ff] to-[#2ec4ff] text-[#220000] border-none py-2.5 px-3.5 rounded-[10px] font-bold cursor-pointer shadow-[0_6px_18px_rgba(45,196,255,0.12)] hover:opacity-90 transition-opacity">
                Ver demo — IA aprendendo
              </button>
              <button id="openNarration" className="bg-transparent border border-white/5 text-[#a7b1c2] py-2.5 px-3.5 rounded-[10px] cursor-pointer hover:bg-white/5 transition-colors">
                Ouvir narração (TTS)
              </button>
            </div>
          </div>

          <div className="w-full md:w-[380px]">
            <img src="images/labia/cerebro.jpg"
              alt="Cérebro IA"
              className="w-full rounded-xl object-cover shadow-[0_6px_24px_rgba(2,6,23,0.6)]" />
          </div>
        </header>

        {/* HISTORY + TECH SECTION */}
        <section 
          id="historyTech" 
          className="fade-up transition-all duration-700 ease-out transform translate-y-10 opacity-0 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start my-7 p-[26px] rounded-xl bg-white/[0.02] border border-white/[0.04]"
        >
          <div className="lg:col-span-2">
            <h2 className="mt-0 text-2xl font-bold mb-4">Breve histórico</h2>
            
            {/* Timeline */}
            <div className="flex gap-3.5 overflow-x-auto p-1 py-3 scrollbar-hide">
              {[
                { year: '1940s — Turing', desc: 'Alan Turing pergunta se máquinas podem pensar.' },
                { year: '1956 — Dartmouth', desc: 'John McCarthy formaliza o termo "IA".' },
                { year: '80s-90s — ML', desc: 'Redes neurais e aprendizado estatístico ganham força.' },
                { year: '2010s-Hoje', desc: 'Deep Learning, GPUs e aplicações reais.' }
              ].map((item, i) => (
                <div key={i} className="min-w-[160px] bg-gradient-to-b from-white/[0.02] to-transparent p-3 rounded-[10px] border border-white/[0.02]">
                  <div className="font-bold text-[#5de0ff] text-[13px]">{item.year}</div>
                  <div className="text-[#a7b1c2] text-[14px] leading-tight mt-1">{item.desc}</div>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold mt-6 mb-2">Como uma IA aprende?</h3>
            <p className="text-[#a7b1c2] text-[14px]">
              Pense em um bebê: primeiro observa padrões simples, depois combina e complica.<br />
              A IA começa com dados, processa em camadas e ajusta parâmetros com erros.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-2">Analogia: do básico ao expert</h3>
            <p className="text-[#a7b1c2] text-[14px]">
              - Início: muitos erros.<br />
              - Intermediário: acertos ocasionais.<br />
              - Avançado: comportamento consistente e robusto.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-2">Porque as Redes Neurais funcionam?</h3>
            <p className="text-[#a7b1c2] text-[14px]">
              Redes neurais foram inspiradas no cérebro humano.<br />
                Assim como neurônios reais se conectam por sinapses,<br /> neurônios artificiais criam conexões que se fortalecem ou enfraquecem conforme o acerto ou erro.
            </p>

            <p className="text-[#a7b1c2] text-[14px]">
              <br />Cada camada aprende algo diferente: padrões simples nas primeiras, combinações nas intermediárias e decisões complexas nas finais — exatamente como o aprendizado humano.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-2">Camadas e processamento</h3>
            <ul className="text-[#a7b1c2] text-[14px] list-disc pl-10 leading-[1.7]">
              <li><strong className="text-white">Camada de entrada:</strong> recebe informações brutas.</li>
              <li><strong className="text-white">Camadas ocultas:</strong> reconhecem padrões.</li>
              <li><strong className="text-white">Camada de saída:</strong> produz a decisão final.</li>
            </ul>

            <p className="text-[#a7b1c2] text-[14px]">
              <br />Durante o treinamento, conexões são ajustadas com base nos erros. Com prática, a rede domina a tarefa — como no mapa mental ao lado.
            </p>

            {/* Imagem Rede Neural */}
            <div className="mt-[18px] mx-auto max-w-[90%] md:max-w-[80%] bg-gradient-to-b from-[rgba(97,21,21,0.02)] to-transparent rounded-xl overflow-hidden flex items-center justify-center border border-white/5 p-2">              <img src="images/labia/rede_neural.jpg"
                alt="Rede Neural"
                className="animate-float w-full h-auto rounded-xl object-cover" />
            </div>
            <p className="text-[#a7b1c2] text-center mt-2 text-xs">
              Estrutura visual de uma Rede Neural — conexões entre neurônios artificiais.
            </p>
          </div>

          {/* LADO DIREITO (Mapa Mental) */}
          <aside className="h-full">
            {/* Adicionei 'sticky top-24' para que a imagem acompanhe o scroll do texto ao lado */}
            <div className="sticky top-24 bg-gradient-to-b from-[rgba(54,6,6,0.02)] to-transparent p-5 rounded-[10px] flex flex-col gap-3 items-center border border-white/[0.02]">
              
              {/* Título centralizado acima da imagem */}
              <div className="font-bold text-[#5de0ff] mb-1">Mapa Mental</div>
              
              {/* Removi mt-[180px] e -ml-20 que estavam quebrando o layout */}
              <div className="rounded-xl overflow-hidden w-full shadow-lg">
                <img src="images/labia/mapa_mental.png"
                  alt="Mapa Mental"
                  className="animate-float w-full h-auto object-cover" />
              </div>
              
              <p className="text-[#a7b1c2] text-center mt-2 text-xs">
                 Conexões lógicas do aprendizado.
              </p>
            </div>
          </aside>
        </section>

        {/* DEMO VIDEO */}
        <section 
            id="demo" 
            className="fade-up transition-all duration-700 ease-out transform translate-y-10 opacity-0 text-center my-7 p-[26px] rounded-xl bg-white/[0.02] border border-white/[0.04]"
        >
          <h2 className="text-center text-2xl font-bold mb-2">Veja uma IA na prática aprendendo algo novo</h2>
          <p className="text-[#a7b1c2] text-center mb-8">
            Abaixo está o time-lapse do treinamento da IA jogando.
          </p>

          <div className="max-w-[900px] mx-auto flex flex-col gap-8 items-center">

            {/* Video Container */}
            <div className="w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-video relative bg-black">
              <iframe 
                src="https://www.youtube.com/embed/qZDeG-qwhc4" 
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Chatbot Container */}
            <div className="w-full max-w-[900px] p-3 flex justify-center">
              <div className="w-full max-w-[600px] bg-[rgba(6,8,15,0.85)] rounded-xl p-4 flex flex-col gap-3 h-[450px] border border-white/[0.06] shadow-2xl font-sans text-left">
                
                {/* Header do Chat */}
                <div className="flex flex-col gap-2 border-b border-white/10 pb-2">
                  <strong className="text-[16px] text-[#e6eef8] flex items-center gap-2">
                    🤖 Assistente Interativo
                  </strong>
                  <span className="text-[13px] text-[#a7b1c2]">Clique para perguntar:</span>

                  {/* AQUI ESTAVA O ERRO: Agora usamos onClick do React */}
                  <div className="flex gap-2 flex-wrap mt-1">
                    {['calculadora', 'ia', 'graficos', 'projeto'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className="bg-white/5 border border-white/10 text-[#a7b1c2] py-1.5 px-3 rounded-full text-[12px] font-semibold hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/50 transition-all capitalize"
                      >
                        {cat === 'ia' ? 'IA na prática' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Área de Mensagens (Renderizada via React State) */}
                <div className="flex-1 overflow-auto p-2 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-white/20">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`
                        py-2 px-3 max-w-[85%] text-sm rounded-xl whitespace-pre-wrap
                        ${msg.sender === 'user' 
                          ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-br-sm" 
                          : "bg-white/10 text-[#e6eef8] rounded-bl-sm"}
                      `}>
                        {renderContent(msg.text)}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 py-2 px-4 rounded-xl text-xs text-gray-400 animate-pulse">
                            Digitando...
                        </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Área de Input */}
                <div className="flex gap-2 pt-2 border-t border-white/5">
                  <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 p-3 rounded-lg border border-white/10 bg-black/20 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/20 text-sm" 
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="py-2 px-4 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20"
                  >
                    Enviar
                  </button>
                </div>
                <small id="statusLine" className="text-[#a7b1c2] text-[12px] mt-0.5 ml-1">
                  Pronto
                </small>
              </div>
            </div>
          </div>
        </section>
        </div>
        {/* ELEMENTOS LATERAIS (Decoração) */}
        {/* Mudei para 'hidden lg:block' (visível em telas > 1024px) */}
        <div className="hidden lg:block pointer-events-none">
          {/* Logo Esquerda */}
          <img 
            src="/logo-projeto.png" 
            alt="Decoration Left" 
            className="fixed top-1/2 left-[50px] -translate-y-1/2 w-[180px] opacity-[0.15] drop-shadow-[0_0_15px_rgba(0,170,255,0.4)] -z-0 grayscale" 
          />
          
          {/* Logo Direita */}
          <img 
            src="/logo-projeto.png" 
            alt="Decoration Right" 
            className="fixed top-1/2 right-[50px] -translate-y-1/2 w-[180px] opacity-[0.15] drop-shadow-[0_0_15px_rgba(0,170,255,0.4)] -z-0 grayscale" 
          />

          {/* Textos GAMES / CAF (Fundo) */}
          <h3 className="fixed top-1/2 -translate-y-1/2 left-[30px] text-[4rem] font-bold text-[#ffffff]/5 tracking-[10px] select-none rotate-90 -z-10">
            GAMES
          </h3>
          <h3 className="fixed top-1/2 -translate-y-1/2 right-[30px] text-[4rem] font-bold text-[#00c8ff]/5 tracking-[10px] select-none -rotate-90 -z-10">
            CAF
          </h3>
        </div>
      </div>
      );
    };
export default LabIA;