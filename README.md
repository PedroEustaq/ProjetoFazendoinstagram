# API Gerador de Post Instagram

API webhook que recebe dados via GET e retorna uma imagem de post do Instagram.

## Instalação

1. Instale as dependências:
```bash
npm install
```

**Nota:** Este projeto usa `@napi-rs/canvas` que é mais fácil de instalar no Windows e não requer bibliotecas nativas adicionais como GTK.

## Como usar

1. Inicie o servidor:
```bash
npm start
```

Ou em modo desenvolvimento (com auto-reload):
```bash
npm run dev
```

2. Acesse a API:

### Exemplo de requisição GET:

```
http://localhost:3000/api/generate?tituloPerfil=Clube%20Atletico%20Mineiro&usernamePerfil=atletico&textoPost=Meu%20post%20aqui&imagemPerfil=attmineiro.jpg&imagemPost=homero.jpg
```

### Parâmetros disponíveis:

- `tituloPerfil` ou `titulo`: Título do perfil
- `usernamePerfil` ou `username`: Username (sem @)
- `textoPost` ou `texto`: Texto do post (use `%0A` para quebra de linha ou `\n`)
- `imagemPerfil` ou `imgPerfil`: Caminho da imagem de perfil (arquivo local ou URL)
- `imagemPost` ou `imgPost`: Caminho da imagem do post (arquivo local ou URL)

### Exemplos:

**Com arquivos locais:**
```
/api/generate?tituloPerfil=Meu%20Perfil&usernamePerfil=meuperfil&textoPost=Texto%20do%20post&imagemPerfil=attmineiro.jpg&imagemPost=homero.jpg
```

**Com URLs:**
```
/api/generate?tituloPerfil=Meu%20Perfil&usernamePerfil=meuperfil&textoPost=Texto%20do%20post&imagemPerfil=https://exemplo.com/foto.jpg&imagemPost=https://exemplo.com/post.jpg
```

**Com quebra de linha no texto:**
```
/api/generate?tituloPerfil=Meu%20Perfil&usernamePerfil=meuperfil&textoPost=Linha%201%0ALinha%202&imagemPerfil=attmineiro.jpg&imagemPost=homero.jpg
```

## Resposta

A API retorna uma imagem PNG diretamente. Você pode:
- Abrir no navegador para ver a imagem
- Salvar a imagem
- Usar em outras aplicações

## Porta

A porta padrão é 3000. Você pode alterar usando a variável de ambiente `PORT`:

```bash
PORT=8080 npm start
```

