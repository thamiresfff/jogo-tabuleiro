document.addEventListener("DOMContentLoaded", () => {
    const tabuleiro = document.getElementById("tabuleiro");
    const mensagem = document.getElementById("mensagem");
    const tamanho = 7;
    let jogadorAtual = "azul";
    let ultimaLinha, ultimaColuna;

    
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

   
    function atualizarMensagem(texto, jogador) {
        mensagem.textContent = texto;
        if (jogador === "azul") {
            mensagem.style.color = "rgb(17, 241, 204)";
        } else if (jogador === "vermelho") {
            mensagem.style.color = "rgb(247, 8, 60)";
        } else {
            mensagem.style.color = "white"; 
        }
    }

   
    function posicionarPeca(linha, coluna, casa) {
        if (!casa.classList.contains("azul") && !casa.classList.contains("vermelho")) {
            if (jogadorAtual === "azul" || verificarAdjacencia(linha, coluna)) {
                
                if (ultimaLinha !== undefined && ultimaColuna !== undefined) {
                    tabuleiro.children[ultimaLinha * tamanho + ultimaColuna].classList.remove("ultima");
                }

                
                casa.classList.add(jogadorAtual, "ultima");
                ultimaLinha = linha;
                ultimaColuna = coluna;

                
                if (verificarVitoria(linha, coluna)) {
                    atualizarMensagem(`Jogador ${jogadorAtual} venceu!`, jogadorAtual);
                    bloquearTabuleiro();
                } else if (verificarEmpate()) {
                    atualizarMensagem("Jogo empatado!", null);
                } else {
                    
                    jogadorAtual = jogadorAtual === "azul" ? "vermelho" : "azul";
                    atualizarMensagem(`Turno do jogador ${jogadorAtual}`, jogadorAtual);
                    destacarCasasValidas();
                }
            }
        }
    }

    
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

    
    function destacarCasasValidas() {
        [...tabuleiro.children].forEach(casa => {
            
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
    
    function verificarEmpate() {
        return [...tabuleiro.children].every(casa => casa.classList.contains("azul") || casa.classList.contains("vermelho"));
    }
    
    function verificarVitoria(linha, coluna) {
        const direcoes = [
            [[0, 1], [0, -1]], 
            [[1, 0], [-1, 0]], 
            [[1, 1], [-1, -1]], 
            [[1, -1], [-1, 1]] 
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



    
    function bloquearTabuleiro() {
        [...tabuleiro.children].forEach(casa => {
            casa.style.pointerEvents = "none";
        });
    }   

    
    criarTabuleiro();
    atualizarMensagem(`Turno do jogador ${jogadorAtual}`, jogadorAtual);
    destacarCasasValidas();
});