#!/bin/bash
set -e

# ------------------------------
# CONFIGURATION
# ------------------------------
SERVER="root@147.79.118.47"
BACKEND_REMOTE_DIR="/var/www/html/api"
LOCAL_BACKEND_DIR="./"

# ------------------------------
# 1️⃣ Upload backend code
# ------------------------------
echo "🚀 Deploying backend to $SERVER:$BACKEND_REMOTE_DIR ..."

# Make sure remote folder exists
ssh $SERVER "mkdir -p $BACKEND_REMOTE_DIR"


# ------------------------------
# 2️⃣ Build and restart Docker
# ------------------------------
ssh $SERVER "
cd $BACKEND_REMOTE_DIR
echo '🛠️ Stopping existing containers...'
docker compose down
echo '🚀 Starting container...'
docker compose up -d --build
"

echo "✅ Backend deployed successfully!"
