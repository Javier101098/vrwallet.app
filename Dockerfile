# Etapa 1: Compilar la aplicación Angular
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias limpias
RUN npm ci

# Copiamos todo el código del proyecto
COPY . .

# Ejecutamos el build (esto genera la carpeta /app/dist/...)
RUN npm run build --configuration=production

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# AJUSTE DE RUTA: 
# Si tu proyecto se llama 'vrwallet', la ruta es esta:
COPY --from=builder /app/dist/vrwallet/browser /usr/share/nginx/html

# Si el build falla aquí, cambia la línea anterior por esta:
# COPY --from=builder /app/dist/siere/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 1212

CMD ["nginx", "-g", "daemon off;"]