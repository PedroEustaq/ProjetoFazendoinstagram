const express = require('express');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Necessário em ambientes com proxy (Render, etc.) para ler protocolo/host corretos
app.set('trust proxy', 1);

// Middleware para parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (imagens, fontes, etc.)
app.use(express.static(__dirname));

// Registrar fontes Chirp
const fontPath = path.join(__dirname, 'Chirp-Font-X-Twitter-main');
try {
    GlobalFonts.registerFromPath(path.join(fontPath, 'Chirp Regular.woff'), 'Chirp');
    GlobalFonts.registerFromPath(path.join(fontPath, 'Chirp Bold.woff'), 'Chirp');
} catch (error) {
    console.warn('Aviso: Não foi possível registrar todas as fontes:', error.message);
}

// Função para quebrar texto
function quebrarTexto(contexto, texto, larguraMaxima) {
    const todasLinhas = [];
    const linhasManuais = texto.split('\n');
    
    for (let l = 0; l < linhasManuais.length; l++) {
        const linhaManual = linhasManuais[l];
        const palavras = linhaManual.split(' ');
        let linhaAtual = '';
        
        for (let i = 0; i < palavras.length; i++) {
            const teste = linhaAtual + (linhaAtual ? ' ' : '') + palavras[i];
            const largura = contexto.measureText(teste).width;
            
            if (largura > larguraMaxima && linhaAtual.length > 0) {
                todasLinhas.push(linhaAtual);
                linhaAtual = palavras[i];
            } else {
                linhaAtual = teste;
            }
        }
        
        if (linhaAtual.length > 0) {
            todasLinhas.push(linhaAtual);
        }
    }
    
    return todasLinhas;
}

// Função auxiliar para desenhar retângulo arredondado (compatibilidade)
function roundRect(ctx, x, y, width, height, radius) {
    if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, width, height, radius);
    } else {
        // Fallback para versões antigas do canvas
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}

// Função para calcular dimensões da imagem do post
function calcularDimensoesImagem(larguraOriginal, alturaOriginal, alturaMaxima, larguraMaxima, alturaMinima, larguraMinima) {
    let proporcao = larguraOriginal / alturaOriginal;
    let novaAltura = alturaOriginal;
    let novaLargura = larguraOriginal;
    
    // Se a altura passar do máximo
    if (novaAltura > alturaMaxima) {
        novaAltura = alturaMaxima;
        novaLargura = alturaMaxima * proporcao;
    }
    
    // Se a largura passar do máximo
    if (novaLargura > larguraMaxima) {
        novaLargura = larguraMaxima;
        novaAltura = larguraMaxima / proporcao;
    }
    
    // Se a altura for menor que o mínimo
    if (novaAltura < alturaMinima) {
        novaAltura = alturaMinima;
        novaLargura = alturaMinima * proporcao;
    }
    
    // Se a largura for menor que o mínimo
    if (novaLargura < larguraMinima) {
        novaLargura = larguraMinima;
        novaAltura = larguraMinima / proporcao;
    }
    
    // Verificar novamente os máximos
    if (novaAltura > alturaMaxima) {
        novaAltura = alturaMaxima;
        novaLargura = alturaMaxima * proporcao;
    }
    
    if (novaLargura > larguraMaxima) {
        novaLargura = larguraMaxima;
        novaAltura = larguraMaxima / proporcao;
    }
    
    return { novaLargura, novaAltura };
}

// Função para gerar a imagem
async function gerarImagemPost(dados) {
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');
    
    // Fundo branco
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, 1080, 1080);
    
    // Desenhar título do perfil
    ctx.fillStyle = '#000';
    ctx.font = 'bold 60px Chirp';
    ctx.fillText(dados.tituloPerfil || 'Título do Perfil', 220, 120);
    
    // Desenhar username
    ctx.font = 'normal 55px Chirp';
    const textoArroba = '@' + (dados.usernamePerfil || 'username');
    ctx.fillText(textoArroba, 220, 180);
    
    // Desenhar texto do post com quebra de linha
    ctx.font = 'normal 55px Chirp';
    const linhas = quebrarTexto(ctx, dados.textoPost || 'Texto do post', 1000);
    const yInicio = 280;
    const espacamentoLinha = 65;
    
    for (let i = 0; i < linhas.length; i++) {
        ctx.fillText(linhas[i], 80, yInicio + (i * espacamentoLinha));
    }
    
    // Carregar e desenhar imagem de perfil
    if (dados.imagemPerfil) {
        try {
            const imgPerfil = await loadImage(dados.imagemPerfil);
            const posicaoY = 60;
            const posicaoX = 50;
            
            ctx.save();
            roundRect(ctx, posicaoX, posicaoY, 150, 150, 999);
            ctx.clip();
            ctx.drawImage(imgPerfil, posicaoX, posicaoY, 150, 150);
            ctx.restore();
        } catch (error) {
            console.error('Erro ao carregar imagem de perfil:', error.message);
        }
    }
    
    // Carregar e desenhar imagem do post
    if (dados.imagemPost) {
        try {
            const imgPost = await loadImage(dados.imagemPost);
            const posicaoDoPostY = 480;
            const posicaoDoPostX = 0;
            const alturaMaxima = 600;
            const larguraMaxima = 1080;
            const alturaMinima = 600;
            const larguraMinima = 600;
            
            const { novaLargura, novaAltura } = calcularDimensoesImagem(
                imgPost.width,
                imgPost.height,
                alturaMaxima,
                larguraMaxima,
                alturaMinima,
                larguraMinima
            );
            
            const xCentralizado = (larguraMaxima - novaLargura) / 2;
            const yCentralizado = (alturaMaxima - novaAltura) / 2;
            
            ctx.save();
            roundRect(ctx, posicaoDoPostX, posicaoDoPostY, larguraMaxima, alturaMaxima, 0);
            ctx.clip();
            ctx.drawImage(
                imgPost,
                posicaoDoPostX + xCentralizado,
                posicaoDoPostY + yCentralizado,
                novaLargura,
                novaAltura
            );
            ctx.restore();
        } catch (error) {
            console.error('Erro ao carregar imagem do post:', error.message);
        }
    }
    
    return canvas.toBuffer('image/png');
}

// Função auxiliar para processar dados GET
function processarDados(req) {
    const query = req.query;
    
    let dados = {
        tituloPerfil: query.tituloPerfil || '',
        usernamePerfil: query.usernamePerfil || '',
        textoPost: query.textoPost || '',
        imagemPerfil: query.imagemPerfil || '',
        imagemPost: query.imagemPost || ''
    };
    
    // Decodificar URL encoding
    if (dados.textoPost) {
        dados.textoPost = decodeURIComponent(dados.textoPost);
        // Processar quebras de linha (%0A)
        dados.textoPost = dados.textoPost.replace(/%0A/g, '\n');
    }
    
    // Verificar se as imagens são caminhos locais
    if (dados.imagemPerfil && !dados.imagemPerfil.startsWith('http') && !dados.imagemPerfil.startsWith('data:')) {
        dados.imagemPerfil = path.join(__dirname, dados.imagemPerfil);
    }
    
    if (dados.imagemPost && !dados.imagemPost.startsWith('http') && !dados.imagemPost.startsWith('data:')) {
        dados.imagemPost = path.join(__dirname, dados.imagemPost);
    }
    
    return dados;
}

// Rota da API - GET
app.get('/api/generate', async (req, res) => {
    try {
        const dados = processarDados(req);
        const imagemBuffer = await gerarImagemPost(dados);
        
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'inline; filename="post-instagram.png"');
        res.send(imagemBuffer);
        
    } catch (error) {
        console.error('Erro ao gerar imagem:', error);
        res.status(500).json({ 
            error: 'Erro ao gerar imagem',
            message: error.message 
        });
    }
});

// Rota para gerar, salvar e remover a imagem após 20 segundos
app.get('/api/save', async (req, res) => {
    try {
        const dados = processarDados(req);
        const imagemBuffer = await gerarImagemPost(dados);

        const nomeArquivo = `post-${Date.now()}.png`;
        const caminhoArquivo = path.join(__dirname, nomeArquivo);

        fs.writeFileSync(caminhoArquivo, imagemBuffer);

        // Agenda remoção do arquivo após 20s (não bloqueia a resposta)
        setTimeout(() => {
            fs.unlink(caminhoArquivo, (err) => {
                if (err) {
                    console.warn(`Não foi possível remover ${nomeArquivo}:`, err.message);
                } else {
                    console.log(`Imagem removida: ${nomeArquivo}`);
                }
            });
        }, 20_000);

        // Monta URL pública usando host/protocolo reais (proxy-friendly)
        const host = req.get('host');
        const protocol = req.protocol;
        const baseUrl = process.env.PUBLIC_URL || `${protocol}://${host}`;

        res.json({
            ok: true,
            file: nomeArquivo,
            url: `${baseUrl}/${nomeArquivo}`,
            expiresInSeconds: 200
        });
    } catch (error) {
        console.error('Erro ao salvar imagem:', error);
        res.status(500).json({ 
            error: 'Erro ao salvar imagem',
            message: error.message 
        });
    }
});

// Rota de documentação
app.get('/', (req, res) => {
    res.send(`
        <h1>API Gerador de Post Instagram</h1>
        <h2>Uso:</h2>
        <p><strong>GET /api/generate</strong></p>
        <h3>Parâmetros (Query String):</h3>
        <ul>
            <li><strong>tituloPerfil</strong> ou <strong>titulo</strong>: Título do perfil</li>
            <li><strong>usernamePerfil</strong> ou <strong>username</strong>: Username (sem @)</li>
            <li><strong>textoPost</strong> ou <strong>texto</strong>: Texto do post (use %0A para quebra de linha)</li>
            <li><strong>imagemPerfil</strong> ou <strong>imgPerfil</strong>: Caminho da imagem de perfil (local ou URL)</li>
            <li><strong>imagemPost</strong> ou <strong>imgPost</strong>: Caminho da imagem do post (local ou URL)</li>
        </ul>
        <h3>Exemplo:</h3>
        <pre>
http://localhost:3000/api/generate?tituloPerfil=Clube%20Atletico%20Mineiro&usernamePerfil=atletico&textoPost=Meu%20post%20aqui%0ASegunda%20linha&imagemPerfil=attmineiro.jpg&imagemPost=homero.jpg
        </pre>
        <h3>Compatível com n8n:</h3>
        <p>Use o nó HTTP Request com método GET e configure os parâmetros na URL ou use "Specify Parameters" no n8n.</p>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Documentação: http://localhost:${PORT}`);
    console.log(`🎨 API: http://localhost:${PORT}/api/generate`);
});

