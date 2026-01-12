#!/bin/bash
set -e

# ------------------------------
# CONFIGURATION
# ------------------------------
SERVER="root@147.79.118.47"
BACKEND_REMOTE_DIR="/var/www/html/api"

# ------------------------------
# 1️⃣ Upload backend code
# ------------------------------
echo "🚀 Deploying backend to $SERVER:$BACKEND_REMOTE_DIR ..."

# ------------------------------
# 2️⃣ Build and restart Docker
# ------------------------------
ssh $SERVER "
cd $BACKEND_REMOTE_DIR
echo '🛠️ Stopping migrate database...'
docker run --rm -i mongo:7 \
mongodump --uri "mongodb+srv://ayasayed:f4Chw0kbKouKQgDV@cluster0.gvzrirv.mongodb.net/ecommerceDB" --archive | \
docker exec -i electroelhany_mongo mongorestore --archive --nsInclude="ecommerceDB.*" --drop
"

echo "✅ Database migrate successfully!"