# 1) Build
FROM node:18-alpine AS build
WORKDIR /app
COPY /appgestionproyectos.client/package.json ./
COPY /appgestionproyectos.client/package-lock.json ./
RUN npm ci
COPY appgestionproyectos.client/ ./

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build   # genera /app/dist

# 2) Servir estáticos + HTTPS automático
FROM caddy:2-alpine
WORKDIR /usr/share/caddy
RUN rm -rf ./*
COPY --from=build /app/dist ./
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
EXPOSE 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]