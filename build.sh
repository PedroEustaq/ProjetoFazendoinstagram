#!/bin/bash
set -e

echo "🔧 Instalando dependências do sistema..."

# Instalar FFmpeg (tentar diferentes métodos)
if ! command -v ffmpeg &> /dev/null; then
    echo "📦 Instalando FFmpeg..."
    
    # Tentar apt-get (Ubuntu/Debian)
    if command -v apt-get &> /dev/null; then
        apt-get update -qq || true
        apt-get install -y -qq ffmpeg || {
            echo "⚠️ Falha ao instalar via apt-get, tentando método alternativo..."
            # Método alternativo: baixar binário estático
            mkdir -p /tmp/ffmpeg
            cd /tmp/ffmpeg
            wget -q https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz || true
            if [ -f ffmpeg-release-amd64-static.tar.xz ]; then
                tar -xf ffmpeg-release-amd64-static.tar.xz
                cp ffmpeg-*-amd64-static/ffmpeg /usr/local/bin/ || true
                cp ffmpeg-*-amd64-static/ffprobe /usr/local/bin/ || true
                chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe || true
            fi
        }
    fi
    
    # Verificar se foi instalado
    if command -v ffmpeg &> /dev/null; then
        echo "✅ FFmpeg instalado com sucesso"
    else
        echo "⚠️ FFmpeg não pôde ser instalado automaticamente"
    fi
else
    echo "✅ FFmpeg já está instalado"
fi

# Verificar versão do FFmpeg
if command -v ffmpeg &> /dev/null; then
    ffmpeg -version | head -n 1
fi

echo "📦 Instalando dependências do Node.js..."
npm install

echo "✅ Build concluído!"

