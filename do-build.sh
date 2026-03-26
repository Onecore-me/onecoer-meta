#!/bin/bash
cd /workspace/onecore
pnpm build 2>&1
echo "EXIT:$?"
