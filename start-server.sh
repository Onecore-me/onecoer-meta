#!/bin/bash
cd /workspace/onecore
PORT=3000 node ./node_modules/next/dist/bin/next start &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"
sleep 4
curl -s -o /dev/null -w "HTTP_STATUS:%{http_code}" http://localhost:3000/ || echo "FAILED"
echo ""
curl -s http://localhost:3000/ | head -20 || echo "No response"
