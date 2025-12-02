#!/bin/bash

echo "🏗️  Multi-Tenant JSON Forms Container Demo"
echo "==========================================="
echo ""

# Function to wait for container to be ready
wait_for_container() {
    local port=$1
    echo "⏳ Waiting for container on port $port to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:$port > /dev/null 2>&1; then
            echo "✅ Container on port $port is ready!"
            break
        fi
        sleep 1
    done
}

# Function to test a tenant
test_tenant() {
    local name=$1
    local port=$2
    local forms=$3
    local company=$4
    local color=$5
    
    echo "🚀 Starting $name tenant..."
    echo "   Company: $company"
    echo "   Forms: $forms"
    echo "   Port: $port"
    
    docker run -d \
        --name "jsonforms-$name" \
        -p $port:80 \
        -e TENANT_FORMS="$forms" \
        -e TENANT_NAME="$company" \
        -e TENANT_PRIMARY_COLOR="$color" \
        jsonforms-app
        
    wait_for_container $port
    echo "📱 Access $name tenant at: http://localhost:$port"
    echo ""
}

# Stop and remove any existing containers
echo "🧹 Cleaning up existing containers..."
docker stop $(docker ps -q --filter ancestor=jsonforms-app) 2>/dev/null || true
docker rm $(docker ps -aq --filter ancestor=jsonforms-app) 2>/dev/null || true

# Test different tenant configurations
test_tenant "brewery" 3001 "whiskey,cheese" "Brewery Corp" "#8B4513"
test_tenant "healthcare" 3002 "person,health" "Healthcare Inc" "#2E8B57"
test_tenant "food" 3003 "cheese" "Gourmet Foods Ltd" "#FF6B35"
test_tenant "consulting" 3004 "person,whiskey" "Executive Consulting" "#4A90E2"

echo "🎉 All tenants deployed successfully!"
echo ""
echo "🌐 Access your tenants:"
echo "   Brewery Corp:           http://localhost:3001 (whiskey + cheese)"
echo "   Healthcare Inc:         http://localhost:3002 (person + health)"
echo "   Gourmet Foods Ltd:      http://localhost:3003 (cheese only)"
echo "   Executive Consulting:   http://localhost:3004 (person + whiskey)"
echo ""
echo "🛑 To stop all tenants: docker stop \$(docker ps -q --filter ancestor=jsonforms-app)"
echo "🗑️  To remove all tenants: docker rm \$(docker ps -aq --filter ancestor=jsonforms-app)"