# Configuração para Render.com

Este guia explica como configurar o projeto no Render.com para que a geração de vídeo funcione corretamente.

## Problema

O Render.com não instala o FFmpeg por padrão, o que é necessário para gerar os vídeos do TikTok.

## Solução

O projeto inclui arquivos de configuração para instalar o FFmpeg automaticamente durante o build:

1. **render.yaml** - Configuração do serviço no Render.com
2. **build.sh** - Script que instala o FFmpeg durante o build

## Configuração no Render.com

### Opção 1: Usando render.yaml (Recomendado)

1. No painel do Render.com, vá em **Settings** → **Build & Deploy**
2. Certifique-se de que o **Build Command** está vazio (o render.yaml já define isso)
3. O Render.com detectará automaticamente o arquivo `render.yaml` e usará as configurações

### Opção 2: Configuração Manual

Se preferir configurar manualmente:

1. Vá em **Settings** → **Build & Deploy**
2. Configure:
   - **Build Command**: `chmod +x build.sh && ./build.sh`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

3. Adicione as variáveis de ambiente:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (ou deixe o Render.com definir automaticamente)

## Verificação

Após o deploy, verifique os logs do build. Você deve ver:

```
✅ FFmpeg instalado com sucesso
```

E nos logs de inicialização:

```
✅ FFmpeg disponível: /usr/bin/ffmpeg
```

## Teste

Após o deploy, teste a geração de vídeo:

```
https://seu-app.onrender.com/api/save?tituloPerfil=Teste&usernamePerfil=teste&textoPost=Teste&imagemPerfil=attmineiro.jpg&imagemPost=homero.jpg
```

A resposta deve incluir o campo `video` com a URL do vídeo gerado.

## Troubleshooting

### Vídeo não é gerado

1. Verifique os logs do servidor para ver se há erros do FFmpeg
2. Verifique se o build.sh foi executado durante o build
3. Verifique se o FFmpeg está disponível nos logs de inicialização

### Erro: "FFmpeg não está disponível"

Isso significa que o FFmpeg não foi instalado durante o build. Verifique:
- Se o build.sh tem permissão de execução
- Se o build command está configurado corretamente
- Os logs do build para ver se houve erros na instalação

### Build falha

Se o build falhar, pode ser que o Render.com não permita instalar pacotes do sistema. Nesse caso:
- Verifique se está usando um plano que permite instalação de pacotes
- Tente usar um buildpack customizado
- Entre em contato com o suporte do Render.com

## Alternativa: Usar FFmpeg via buildpack

Se o script de build não funcionar, você pode tentar usar um buildpack:

1. Vá em **Settings** → **Build & Deploy**
2. Adicione um buildpack customizado:
   - URL: `https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git`

Nota: Esta é uma solução alternativa caso o build.sh não funcione.

