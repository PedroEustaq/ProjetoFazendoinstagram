# Configuração para n8n

Este guia mostra como configurar a API no n8n para gerar posts do Instagram usando GET.

## Configuração do n8n

### 1. Adicione um nó HTTP Request

1. Adicione o nó **HTTP Request** ao seu workflow
2. Configure da seguinte forma:

**Configurações Básicas:**
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/generate` (ou sua URL do servidor)
- **Authentication**: None (ou configure se necessário)

### 2. Configuração com Edit Fields (Recomendado)

Se você está usando um nó **Edit Fields** antes do HTTP Request:

1. Configure os campos no **Edit Fields** com os mesmos nomes:
   - `tituloPerfil`
   - `usernamePerfil`
   - `textoPost`
   - `imagemPerfil`
   - `imagemPost`

2. No nó **HTTP Request**, configure:
   - **Method**: `GET`
   - **URL**: `http://localhost:3000/api/generate`
   - **Specify Parameters**: ✅ Marque esta opção
   - **Parameters**: Adicione os seguintes parâmetros:
     - `tituloPerfil`: `{{ $json.tituloPerfil }}`
     - `usernamePerfil`: `{{ $json.usernamePerfil }}`
     - `textoPost`: `{{ $json.textoPost }}`
     - `imagemPerfil`: `{{ $json.imagemPerfil }}`
     - `imagemPost`: `{{ $json.imagemPost }}`

**OU** você pode construir a URL manualmente:
   - **URL**: `http://localhost:3000/api/generate?tituloPerfil={{ $json.tituloPerfil }}&usernamePerfil={{ $json.usernamePerfil }}&textoPost={{ $json.textoPost }}&imagemPerfil={{ $json.imagemPerfil }}&imagemPost={{ $json.imagemPost }}`

### 3. Exemplo Completo de Workflow

```
[Trigger] → [Edit Fields] → [HTTP Request] → [Salvar Arquivo]
```

**Edit Fields - Configuração:**
```
tituloPerfil: "Clube Atletico Mineiro"
usernamePerfil: "atletico"
textoPost: "Meu post aqui\nSegunda linha"
imagemPerfil: "attmineiro.jpg"
imagemPost: "homero.jpg"
```

**HTTP Request - Configuração:**
- Method: GET
- URL: http://localhost:3000/api/generate
- Specify Parameters: ✅ Ativado
- Parameters:
  - tituloPerfil: `{{ $json.tituloPerfil }}`
  - usernamePerfil: `{{ $json.usernamePerfil }}`
  - textoPost: `{{ $json.textoPost }}`
  - imagemPerfil: `{{ $json.imagemPerfil }}`
  - imagemPost: `{{ $json.imagemPost }}`

**Response:**
- A resposta será uma imagem PNG
- Você pode salvar usando o nó "Write Binary File" ou "Download File"

### 4. Quebra de Linha no Texto

Para quebrar linha no texto, use `\n` no Edit Fields:
```
textoPost: "Primeira linha\nSegunda linha\nTerceira linha"
```

O n8n converterá automaticamente para `%0A` na URL.

### 5. Imagens

As imagens podem ser:
- **Arquivos locais**: `nome-do-arquivo.jpg` (deve estar na pasta do servidor)
- **URLs**: `https://exemplo.com/imagem.jpg`
- **Base64**: `data:image/jpeg;base64,...` (suportado)

### 6. Exemplo de Dados no Edit Fields

```
tituloPerfil: "Clube Atletico Mineiro"
usernamePerfil: "atletico"
textoPost: "Galo forte vingador!\nSempre na frente!"
imagemPerfil: "attmineiro.jpg"
imagemPost: "homero.jpg"
```

### 7. Exemplo de URL Gerada

A URL final será algo como:
```
http://localhost:3000/api/generate?tituloPerfil=Clube%20Atletico%20Mineiro&usernamePerfil=atletico&textoPost=Galo%20forte%20vingador!%0ASempre%20na%20frente!&imagemPerfil=attmineiro.jpg&imagemPost=homero.jpg
```

## Troubleshooting

**Erro 500:**
- Verifique se o servidor está rodando
- Verifique se os caminhos das imagens estão corretos
- Veja os logs do servidor para mais detalhes

**Imagem não aparece:**
- Verifique se o arquivo de imagem existe na pasta do servidor
- Ou use uma URL válida

**Quebra de linha não funciona:**
- Use `\n` no JSON (não `%0A`)
- O sistema processa automaticamente

