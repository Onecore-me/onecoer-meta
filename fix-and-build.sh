#!/bin/bash
set -e
cd /workspace/onecore

echo "=== Checking installed packages ==="
for pkg in styled-jsx postcss autoprefixer tailwindcss; do
  if [ ! -f "node_modules/$pkg/package.json" ]; then
    echo "Installing $pkg..."
    cd /tmp
    rm -f /tmp/$pkg-*.tgz
    npm pack $pkg --quiet 2>/dev/null
    tarball=$(ls /tmp/$pkg-*.tgz 2>/dev/null | head -1)
    if [ -n "$tarball" ]; then
      cd /workspace/onecore
      rm -rf "node_modules/$pkg"
      mkdir -p "node_modules/$pkg"
      tar -xzf "$tarball" -C "node_modules/$pkg" --strip-components=1
      echo "$pkg installed"
    fi
  else
    echo "$pkg already installed"
  fi
done

# Install next v14 if not present
if [ ! -f "node_modules/next/package.json" ]; then
  echo "Installing next@14.2.5..."
  cd /tmp
  rm -f /tmp/next-14.2.5.tgz
  npm pack next@14.2.5 --quiet 2>/dev/null
  cd /workspace/onecore
  mkdir -p node_modules/next
  tar -xzf /tmp/next-14.2.5.tgz -C node_modules/next --strip-components=1
  echo "next installed"
fi

echo "=== Creating bin symlinks ==="
mkdir -p node_modules/.bin
for pkg in next; do
  if [ -f "node_modules/$pkg/dist/bin/$pkg" ]; then
    ln -sf "../$pkg/dist/bin/$pkg" "node_modules/.bin/$pkg"
    echo "$pkg bin linked"
  fi
done

echo "=== Running build ==="
node node_modules/next/dist/bin/next build
echo "BUILD_DONE"
