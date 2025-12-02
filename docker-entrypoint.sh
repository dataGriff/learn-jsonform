#!/bin/sh
set -e

# Create env config file with environment variables
cat > /usr/share/nginx/html/env-config.js << EOF
window.ENV = {
  TENANT_FORMS: "${TENANT_FORMS:-whiskey,cheese}",
  TENANT_NAME: "${TENANT_NAME:-Default Company}",
  TENANT_PRIMARY_COLOR: "${TENANT_PRIMARY_COLOR:-#1976d2}",
  TENANT_SECONDARY_COLOR: "${TENANT_SECONDARY_COLOR:-#dc004e}"
};
EOF

# Start nginx
exec nginx -g "daemon off;"