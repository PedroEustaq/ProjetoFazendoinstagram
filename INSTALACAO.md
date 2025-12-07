# Instalação - Dependências do Canvas

Este projeto usa `@napi-rs/canvas` que é mais fácil de instalar e não requer dependências nativas adicionais na maioria dos casos.

## Instalação Simples

```bash
npm install
```

Se você encontrar problemas, as instruções abaixo são para o `canvas` antigo (não é necessário com `@napi-rs/canvas`):

---

## Instalação do Canvas Antigo (não necessário)

O `node-canvas` requer algumas dependências nativas do sistema. Siga as instruções abaixo:

## Windows

Instale o Visual Studio Build Tools:
- Baixe e instale: https://visualstudio.microsoft.com/downloads/
- Selecione "Desktop development with C++" durante a instalação

Depois execute:
```bash
npm install
```

## Linux (Ubuntu/Debian)

```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm install
```

## macOS

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm install
```

## Testando a API

Após instalar, inicie o servidor:
```bash
npm start
```

Teste acessando no navegador:
```
http://localhost:3000/api/generate?tituloPerfil=Teste&usernamePerfil=teste&textoPost=Meu%20post&imagemPerfil=attmineiro.jpg&imagemPost=homero.jpg
```

