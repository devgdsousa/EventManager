# Usar uma imagem base do Node.js
FROM node:16

# Configurar o diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Instalar o Prisma CLI globalmente
RUN npm install -g prisma

# Copiar o restante do código da aplicação
COPY . .

# Instalar o TypeScript globalmente para desenvolvimento
RUN npm install -g typescript ts-node

# Expor a porta da aplicação
EXPOSE 3333

# Comando para iniciar o servidor
CMD ["npm", "run", "dev"]
