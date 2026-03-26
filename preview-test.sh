#!/bin/bash
echo "=== OneCore 元栈 Preview Test ==="
echo ""

# Test homepage
echo "1. Homepage (/)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
echo "   Status: $STATUS"

# Test login page
echo "2. Login (/login)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login)
echo "   Status: $STATUS"

# Test register page
echo "3. Register (/register)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/register)
echo "   Status: $STATUS"

# Test dashboard
echo "4. Dashboard (/dashboard)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/dashboard)
echo "   Status: $STATUS"

# Test profile page
echo "5. Profile (/profile)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/profile)
echo "   Status: $STATUS"

# Test API endpoints
echo "6. API - Register (/api/auth?method=register)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"testuser","password":"Test1234"}' \
  http://localhost:3000/api/auth)
echo "   Status: $STATUS"

# Test login
echo "7. API - Login (/api/auth?method=login)"
RESP=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234"}' \
  http://localhost:3000/api/auth)
echo "   Response: $RESP" | head -c 200

echo ""
echo "=== Test Complete ==="
