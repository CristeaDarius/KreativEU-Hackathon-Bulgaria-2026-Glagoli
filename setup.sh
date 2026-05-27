#!/bin/bash

echo "Installing dependencies..."
npm install

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example — update it with your values."
fi

echo ""
echo "Done! Run the app with: npm run dev"
