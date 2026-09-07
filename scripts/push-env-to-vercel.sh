#!/usr/bin/env bash
# Push environment variables from .env.local to Vercel
# Usage: ./scripts/push-env-to-vercel.sh

set -e

if [ ! -f .env.local ]; then
  echo "Error: .env.local not found"
  exit 1
fi

if ! command -v vercel &> /dev/null; then
  echo "Error: vercel CLI not installed. Run: npm i -g vercel"
  exit 1
fi

echo "Reading .env.local..."
echo ""

while IFS= read -r line || [ -n "$line" ]; do
  # Skip blank lines and comments
  case "$line" in
    ''|\#*) continue ;;
  esac

  # Split on first =
  key="${line%%=*}"
  value="${line#*=}"

  # Strip surrounding quotes if present
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"

  if [ -z "$value" ]; then
    echo "Skipping empty: $key"
    continue
  fi

  echo "Setting: $key"
  vercel env add "$key" production <<< "$value" > /dev/null
  vercel env add "$key" preview <<< "$value" > /dev/null
  vercel env add "$key" development <<< "$value" > /dev/null
done < .env.local

echo ""
echo "Done. Run 'vercel env ls' to verify."
echo "Then run 'vercel --prod' to deploy."
