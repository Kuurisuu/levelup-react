#!/bin/bash
# Script para desplegar frontend en EC2 con Nginx
# Uso: ./deploy-frontend.sh

echo "🚀 Desplegando frontend en EC2..."

# Variables (configurar según tu entorno)
FRONTEND_DIR="/home/ec2-user/levelup-react"
BACKEND_IP="${BACKEND_IP:-tu-ip-backend}"
NGINX_ROOT="/usr/share/nginx/html"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Instalando..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
fi

# Verificar instalación
echo "📦 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Ir al directorio del frontend
cd "$FRONTEND_DIR" || exit 1

# Instalar dependencias
echo "📥 Instalando dependencias..."
npm install

# Crear archivo .env.production si no existe
if [ ! -f .env.production ]; then
    echo "📝 Creando .env.production..."
    cat > .env.production << EOF
VITE_API_BASE_URL=http://${BACKEND_IP}:8080/api/v1
VITE_IMAGE_BASE_URL=http://${BACKEND_IP}:8003
VITE_GATEWAY_URL=http://${BACKEND_IP}:8080
EOF
fi

# Compilar para producción
echo "🔨 Compilando aplicación..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error al compilar"
    exit 1
fi

# Verificar que existe carpeta dist
if [ ! -d "dist" ]; then
    echo "❌ Carpeta dist no encontrada"
    exit 1
fi

# Instalar Nginx si no está instalado
if ! command -v nginx &> /dev/null; then
    echo "📥 Instalando Nginx..."
    sudo yum install -y nginx
fi

# Configurar Nginx
echo "⚙️  Configurando Nginx..."
sudo tee /etc/nginx/conf.d/levelup.conf > /dev/null << EOF
server {
    listen 80;
    server_name _;
    
    root ${NGINX_ROOT};
    index index.html;
    
    # Servir archivos estáticos
    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # Cachear assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Proxy para APIs (opcional, si quieres usar /api en el mismo dominio)
    location /api {
        proxy_pass http://${BACKEND_IP}:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Copiar archivos compilados
echo "📋 Copiando archivos a Nginx..."
sudo rm -rf ${NGINX_ROOT}/*
sudo cp -r dist/* ${NGINX_ROOT}/
sudo chown -R nginx:nginx ${NGINX_ROOT}

# Verificar configuración de Nginx
echo "✅ Verificando configuración de Nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
    # Reiniciar Nginx
    echo "🔄 Reiniciando Nginx..."
    sudo systemctl enable nginx
    sudo systemctl restart nginx
    echo "✅ Frontend desplegado exitosamente!"
    echo "🌐 Accede a: http://$(curl -s ifconfig.me || hostname -I | awk '{print $1}')"
else
    echo "❌ Error en configuración de Nginx"
    exit 1
fi

# Mostrar estado
echo "📊 Estado de Nginx:"
sudo systemctl status nginx --no-pager

echo "🎉 Despliegue completado!"

