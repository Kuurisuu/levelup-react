#!/bin/bash
# Script para actualizar frontend desde GitHub
# Uso: ./update-frontend.sh

echo "🔄 Actualizando frontend..."

# Directorio del proyecto (ajustar según tu estructura)
PROJECT_DIR="/home/ec2-user/levelup-react"
NGINX_ROOT="/usr/share/nginx/html"

# Verificar si el directorio existe
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Directorio del proyecto no encontrado: $PROJECT_DIR"
    echo "💡 Asegúrate de que el repositorio está clonado en $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR" || exit 1

# Pull del repositorio
echo "📥 Descargando cambios desde Git..."
git pull origin main 2>&1 || git pull origin master 2>&1

# Cargar variables de entorno si existe archivo .env
if [ -f "/home/ec2-user/.env" ]; then
    echo "📋 Cargando variables de entorno..."
    set -a
    source /home/ec2-user/.env
    set +a
fi

# Variables de entorno del backend (configurar según tu setup)
BACKEND_DOMAIN="${BACKEND_DOMAIN:-api.tudominio.com}"
BACKEND_HTTPS="${BACKEND_HTTPS:-https://$BACKEND_DOMAIN}"

# Si es HTTP (sin dominio configurado)
if [ "$BACKEND_DOMAIN" = "api.tudominio.com" ] && [ -n "$BACKEND_IP" ]; then
    BACKEND_HTTPS="http://$BACKEND_IP:8080"
fi

echo "🌐 Configurando URLs del backend: $BACKEND_HTTPS"

# Actualizar .env.production
cat > .env.production << EOF
VITE_API_BASE_URL=${BACKEND_HTTPS}/api/v1
VITE_IMAGE_BASE_URL=${BACKEND_HTTPS}
VITE_GATEWAY_URL=${BACKEND_HTTPS}
EOF

echo "📋 Archivo .env.production actualizado"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

# Instalar dependencias (si hay cambios en package.json)
echo "📦 Instalando dependencias..."
npm install --production=false

if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias"
    exit 1
fi

# Compilar
echo "🔨 Compilando aplicación para producción..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error compilando aplicación"
    exit 1
fi

# Verificar que existe carpeta dist
if [ ! -d "dist" ]; then
    echo "❌ Carpeta dist no encontrada después de compilar"
    exit 1
fi

# Verificar Nginx
if ! command -v nginx &> /dev/null; then
    echo "⚠️  Nginx no está instalado. Instalando..."
    sudo yum install -y nginx || sudo apt install -y nginx
fi

# Crear backup del contenido anterior (opcional)
if [ -d "$NGINX_ROOT" ] && [ "$(ls -A $NGINX_ROOT 2>/dev/null)" ]; then
    BACKUP_DIR="/tmp/nginx-backup-$(date +%Y%m%d-%H%M%S)"
    echo "💾 Creando backup en $BACKUP_DIR"
    sudo mkdir -p "$BACKUP_DIR"
    sudo cp -r "$NGINX_ROOT"/* "$BACKUP_DIR/" 2>/dev/null
fi

# Copiar archivos compilados
echo "📋 Copiando archivos a Nginx..."
sudo rm -rf "$NGINX_ROOT"/*
sudo cp -r dist/* "$NGINX_ROOT"/
sudo chown -R nginx:nginx "$NGINX_ROOT"

# Verificar configuración de Nginx
echo "✅ Verificando configuración de Nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
    # Reiniciar Nginx
    echo "🔄 Reiniciando Nginx..."
    sudo systemctl enable nginx
    sudo systemctl restart nginx
    
    # Verificar estado
    if sudo systemctl is-active --quiet nginx; then
        echo "✅ Frontend actualizado exitosamente!"
        echo ""
        echo "🌐 URLs disponibles:"
        echo "   HTTP:  http://$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')"
        if [ -n "$DOMAIN" ]; then
            echo "   HTTPS: https://www.$DOMAIN"
        fi
    else
        echo "❌ Nginx no se inició correctamente"
        echo "📋 Ver logs: sudo tail -f /var/log/nginx/error.log"
        exit 1
    fi
else
    echo "❌ Error en configuración de Nginx"
    exit 1
fi

echo ""
echo "📊 Estado de Nginx:"
sudo systemctl status nginx --no-pager -l

echo ""
echo "🎉 Actualización completada!"

