type Jogada = 'pedra' | 'papel' | 'tesoura';

class JokenpoService {
    // Memória da IA
    private historicoTransicoes: Record<string, Record<string, number>> = {};
    private ultimaJogadaUsuario: Jogada | null = null;
    
    // Definimos explicitamente que esse array é somente leitura e contém Jogadas
    private readonly opcoes: readonly Jogada[] = ['pedra', 'papel', 'tesoura'];

    // --- Métodos Auxiliares ---

    private jogadaAleatoria(): Jogada {
        const randomIndex = Math.floor(Math.random() * this.opcoes.length);
        // CORREÇÃO 1: O TS não garante que array[index] existe sempre.
        // Forçamos com 'as Jogada' pois sabemos que a matemática está certa.
        return this.opcoes[randomIndex] as Jogada;
    }

    private oQueGanhaDe(jogada: Jogada): Jogada {
        const contraAtaque: Record<Jogada, Jogada> = {
            'pedra': 'papel',
            'papel': 'tesoura',
            'tesoura': 'pedra'
        };
        return contraAtaque[jogada];
    }

    // --- Lógica Principal da IA ---

    public iaFazJogada(): Jogada {
        const usuarioAnterior = this.ultimaJogadaUsuario;

        // 1. Verifica se temos usuário anterior E se existe histórico para ele
        if (!usuarioAnterior || !this.historicoTransicoes[usuarioAnterior]) {
            return this.jogadaAleatoria();
        }

        // CORREÇÃO 2: Criamos uma variável local segura. 
        // Como passamos pelo IF acima, o TS sabe que 'transicoes' não é undefined aqui.
        const transicoes = this.historicoTransicoes[usuarioAnterior];
        
        // 3. Encontra a jogada mais provável
        let jogadaMaisProvavel: Jogada | null = null;
        let maxContagem = -1;

        // Object.entries agora funciona porque 'transicoes' está garantido
        for (const [jogada, contagem] of Object.entries(transicoes)) {
            if (contagem > maxContagem) {
                maxContagem = contagem;
                jogadaMaisProvavel = jogada as Jogada;
            }
        }

        // 4. Se detectamos padrão, jogamos o que ganha dele
        if (jogadaMaisProvavel) {
            console.log(`IA Previu: ${jogadaMaisProvavel} (baseado em ${usuarioAnterior})`);
            return this.oQueGanhaDe(jogadaMaisProvavel);
        }

        return this.jogadaAleatoria();
    }

    public atualizarModeloIA(jogadaAtual: Jogada): void {
        const usuarioAnterior = this.ultimaJogadaUsuario;

        // Só aprendemos se tivermos uma jogada anterior registrada
        if (usuarioAnterior) {
            
            // CORREÇÃO 3: Inicialização segura para evitar erro "Object possibly undefined"
            // Se não existe o registro da jogada anterior, cria um objeto vazio
            if (!this.historicoTransicoes[usuarioAnterior]) {
                this.historicoTransicoes[usuarioAnterior] = {};
            }

            // Pegamos a referência do objeto (agora garantido que existe)
            const historicoDoUsuario = this.historicoTransicoes[usuarioAnterior];

            // Se não existe contagem para a jogada ATUAL, inicia com 0
            if (historicoDoUsuario[jogadaAtual] === undefined) {
                historicoDoUsuario[jogadaAtual] = 0;
            }

            // Incrementa
            historicoDoUsuario[jogadaAtual] += 1;
        }

        // Atualiza a memória para a próxima rodada
        this.ultimaJogadaUsuario = jogadaAtual;
    }

    public processarJogo(escolhaUsuario: Jogada) {
        // 1. IA decide
        const escolhaMaquina = this.iaFazJogada();

        // 2. IA aprende
        this.atualizarModeloIA(escolhaUsuario);

        return escolhaMaquina;
    }
}

export default new JokenpoService();