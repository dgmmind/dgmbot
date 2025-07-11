# Usa la imagen oficial de Node.js 20 LTS
FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar todo el proyecto
COPY . .

# Exponer puerto (si tu bot usa alguno, ejemplo 3000)
# EXPOSE 3000

# Comando para arrancar tu bot
CMD ["npm", "start"]
