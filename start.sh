#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  Ryanair Explorer — Lancer le serveur (Mac / Linux)
#  Double-cliquez ou exécutez : bash start.sh
# ─────────────────────────────────────────────────────────────

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║          RYANAIR EXPLORER — DÉMARRAGE        ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js n'est pas installé."
  echo "   Téléchargez-le sur : https://nodejs.org"
  exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js détecté : $NODE_VERSION"
echo ""
echo "🚀 Démarrage du serveur..."
echo "   → Ouvrez votre navigateur sur : http://localhost:3000"
echo ""
echo "   Ctrl+C pour arrêter"
echo ""

# Ouvrir le navigateur automatiquement (Mac)
if [[ "$OSTYPE" == "darwin"* ]]; then
  sleep 1 && open "http://localhost:3000" &
fi

# Ouvrir le navigateur automatiquement (Linux)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  sleep 1 && (xdg-open "http://localhost:3000" 2>/dev/null || true) &
fi

node server.js
