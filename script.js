document.addEventListener("DOMContentLoaded", () => {
    const tabuleiro = document.getElementById("tabuleiro");
    const mensagem = document.getElementById("mensagem");
    const tamanho = 7;
    let jogadorAtual = "azul";
    let ultimaLinha, ultimaColuna;

    // Função para criar o tabuleiro de 7x7
    function criarTabuleiro() {
        for (let linha = 0; linha < tamanho; linha++) {
            for (let coluna = 0; coluna < tamanho; coluna++) {
                const casa = document.createElement("div");
                casa.classList.add("casa");
                casa.dataset.linha = linha;
                casa.dataset.coluna = coluna;
                casa.addEventListener("click", () => posicionarPeca(linha, coluna, casa));
                tabuleiro.appendChild(casa);
            }
        }
        atualizarMensagem(`Turno do jogador ${jogadorAtual}`, jogadorAtual);
    }

    // Função para atualizar a mensagem e a cor do texto conforme o jogador atual
    function atualizarMensagem(texto, jogador) {
        mensagem.textContent = texto;
        if (jogador === "azul") {
            mensagem.style.color = "rgb(17, 241, 204)";
        } else if (jogador === "vermelho") {
            mensagem.style.color = "rgb(247, 8, 60)";
        } else {
            mensagem.style.color = "white"; // Padrão para empates
        }
    }

    // Função para posicionar uma peça no tabuleiro
    function posicionarPeca(linha, coluna, casa) {
        if (!casa.classList.contains("azul") && !casa.classList.contains("vermelho")) {
            if (jogadorAtual === "azul" || verificarAdjacencia(linha, coluna)) {
                // Remove a marcação da última peça jogada
                if (ultimaLinha !== undefined && ultimaColuna !== undefined) {
                    tabuleiro.children[ultimaLinha * tamanho + ultimaColuna].classList.remove("ultima");
                }

                // Adiciona a cor e marcação da nova peça jogada
                casa.classList.add(jogadorAtual, "ultima");
                ultimaLinha = linha;
                ultimaColuna = coluna;

                // Verifica se há vitória ou empate
                if (verificarVitoria(linha, coluna)) {
                    atualizarMensagem(`Jogador ${jogadorAtual} venceu!`, jogadorAtual);
                    bloquearTabuleiro();
                } else if (verificarEmpate()) {
                    atualizarMensagem("Jogo empatado!", null);
                } else {
                    // Alterna o jogador e atualiza a mensagem
                    jogadorAtual = jogadorAtual === "azul" ? "vermelho" : "azul";
                    atualizarMensagem(`Turno do jogador ${jogadorAtual}`, jogadorAtual);
                    destacarCasasValidas();
                }
            }
        }
    }

    // Função para verificar se a casa é adjacente à última jogada
    function verificarAdjacencia(linha, coluna) {
        const direcoes = [
            [0, 1], [1, 1], [1, 0], [1, -1],
            [0, -1], [-1, -1], [-1, 0], [-1, 1]
        ];
        for (const [dx, dy] of direcoes) {
            const novaLinha = ultimaLinha + dx;
            const novaColuna = ultimaColuna + dy;
            if (novaLinha === linha && novaColuna === coluna) {
                return true;
            }
        }
        return false;
    }

    // Função para destacar as casas válidas para a próxima jogada
    function destacarCasasValidas() {
        [...tabuleiro.children].forEach(casa => {
            // Remove a classe "destacada" de todas as casas
            casa.classList.remove("destacada");
        });

        if (ultimaLinha !== undefined && ultimaColuna !== undefined) {
            const direcoes = [
                [0, 1], [1, 1], [1, 0], [1, -1],
                [0, -1], [-1, -1], [-1, 0], [-1, 1]
            ];
            for (const [dx, dy] of direcoes) {
                const novaLinha = ultimaLinha + dx;
                const novaColuna = ultimaColuna + dy;
                if (novaLinha >= 0 && novaLinha < tamanho && novaColuna >= 0 && novaColuna < tamanho) {
                    const casaAdjacente = tabuleiro.children[novaLinha * tamanho + novaColuna];
                    if (!casaAdjacente.classList.contains("azul") && !casaAdjacente.classList.contains("vermelho")) {
                        casaAdjacente.classList.add("destacada");
                    }
                }
            }
        }
    }
    // Função para verificar se o jogo terminou empatado
    function verificarEmpate() {
        return [...tabuleiro.children].every(casa => casa.classList.contains("azul") || casa.classList.contains("vermelho"));
    }
    // Função para verificar se houve vitória
    function verificarVitoria(linha, coluna) {
        const direcoes = [
            [[0, 1], [0, -1]], // Horizontal
            [[1, 0], [-1, 0]], // Vertical
            [[1, 1], [-1, -1]], // Diagonal principal
            [[1, -1], [-1, 1]] // Diagonal secundária
        ];
        for (const direcao of direcoes) {
            let contagem = 1;
            for (const [dx, dy] of direcao) {
                let novaLinha = linha + dx;
                let novaColuna = coluna + dy;
                while (
                    novaLinha >= 0 && novaLinha < tamanho && 
                    novaColuna >= 0 && novaColuna < tamanho && 
                    tabuleiro.children[novaLinha * tamanho + novaColuna].classList.contains(jogadorAtual)
                ) {
                    contagem++;
                    if (contagem === 4) {
                        return true;
                    }
                    novaLinha += dx;
                    novaColuna += dy;
                }
            }
        }
        return false;
    }



    // Função para bloquear o tabuleiro após o término do jogo
    function bloquearTabuleiro() {
        [...tabuleiro.children].forEach(casa => {
            casa.style.pointerEvents = "none";
        });
    }   

    // Inicializa o tabuleiro e destaca as casas válidas
    criarTabuleiro();
    atualizarMensagem(`Turno do jogador ${jogadorAtual}`, jogadorAtual);
    destacarCasasValidas();
});