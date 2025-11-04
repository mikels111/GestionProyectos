# ====== Stage 1: Build ======
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiamos solo los .csproj primero (mejor caché del restore)
COPY AppGestionProyectos.Server/AppGestionProyectos.Server.csproj AppGestionProyectos.Server/
# Si tu .csproj referencia otros proyectos, copia también sus .csproj aquí.

RUN dotnet restore AppGestionProyectos.Server/AppGestionProyectos.Server.csproj

# Copiamos el resto del código
COPY AppGestionProyectos.Server/ AppGestionProyectos.Server/
WORKDIR /src/AppGestionProyectos.Server

# Publicamos Release, sin host nativo
RUN dotnet publish AppGestionProyectos.Server.csproj -c Release -o /app/publish /p:UseAppHost=false

# ====== Stage 2: Runtime ======
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Escuchar en 80 dentro del contenedor
ENV ASPNETCORE_URLS=http://+:80
# (Opcional) Menos overhead de diagnósticos en prod
ENV DOTNET_EnableDiagnostics=0

COPY --from=build /app/publish .
COPY AppGestionProyectos.Server/Templates ./Templates
EXPOSE 80
EXPOSE 443

ENTRYPOINT ["dotnet", "AppGestionProyectos.Server.dll"]
