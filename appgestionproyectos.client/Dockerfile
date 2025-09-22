FROM node:18-alpine

WORKDIR /app

#COPY /appgestionproyectos.client/package.json .
#COPY /appGestionproyectos.client/package-lock.json .

COPY /appgestionproyectos.client/package.json ./
COPY /appgestionproyectos.client/package-lock.json ./  

#RUN npm install
RUN npm ci

#COPY . .
COPY appgestionproyectos.client ./

EXPOSE 3000

#CMD ["npm", "run", "dev"]
#dev para docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]