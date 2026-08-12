# 1) Build
#FROM node:18-alpine AS build
#WORKDIR /app
#COPY /appgestionproyectos.client/package.json ./
#COPY /appgestionproyectos.client/package-lock.json ./
#RUN npm ci
#COPY appgestionproyectos.client/ ./

#ARG VITE_API_URL
#ENV VITE_API_URL=${VITE_API_URL}
#RUN npm run build   # genera /app/dist

# 2) Servir estáticos + HTTPS automático
#FROM caddy:2-alpine
#WORKDIR /usr/share/caddy
#RUN rm -rf ./*
#COPY --from=build /app/dist ./
#COPY Caddyfile /etc/caddy/Caddyfile
#EXPOSE 80
#EXPOSE 443

#CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]



#CONFIGURACIÓN NGINX

# ====== Stage 1: Build React ======
FROM node:18-alpine AS build
WORKDIR /app

# Copiar dependencias
COPY appgestionproyectos.client/package*.json ./
RUN npm ci

# Copiar código
COPY appgestionproyectos.client/ ./

# Variable para la API
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build producción
RUN npm run build



# ====== Stage 2: NGINX ======
FROM nginx:alpine

# Eliminar config default
RUN rm /etc/nginx/conf.d/default.conf

# Copiar build generado
COPY --from=build /app/dist /usr/share/nginx/html/app1

# Copiar configuración nginx
COPY appgestionproyectos.client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]