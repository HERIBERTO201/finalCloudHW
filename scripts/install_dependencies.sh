#!/bin/bash
# Navegar a la carpeta donde CodeDeploy puso el backend
cd /home/ubuntu/cloudhw-backend-deploy

# Instalar dependencias de producción solamente
npm install --production
