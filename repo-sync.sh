#!/usr/bin/env bash
set -euo pipefail

# ===== CONFIG =====
# Repo A (source of truth): next-block
SOURCE_REPO_DIR="$(pwd)"   # run inside next-block repo

# Repo B (target): VaultBackend
TARGET_REPO_URL="github.com/Metapolitanltd/VaultBackend.git"
TARGET_BRANCH="main"

AUTHOR_NAME="amirtaherkhani"
AUTHOR_EMAIL="amirtaherkhani@outlook.com"
# ==================

echo "Source repo (A): next-block"
echo "Target repo (B): VaultBackend"
echo

# ---- Ask for token securely ----
read -s -p "Enter GitHub Personal Access Token: " GITHUB_TOKEN
echo
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Token cannot be empty"
  exit 1
fi

# ---- Go to source repo (A) ----
cd "$SOURCE_REPO_DIR"

if [ ! -d ".git" ]; then
  echo "❌ This directory is not a git repository (expected next-block)"
  exit 1
fi

# ---- Configure author ----
git config user.name "$AUTHOR_NAME"
git config user.email "$AUTHOR_EMAIL"

# ---- Verify access to target repo (B) ----
echo "🔍 Verifying access to target repo (VaultBackend)..."
git ls-remote \
  "https://x-access-token:${GITHUB_TOKEN}@${TARGET_REPO_URL}" \
  HEAD >/dev/null
echo "✅ Access verified"

# ---- Add or update remote ----
REMOTE_URL="https://x-access-token:${GITHUB_TOKEN}@${TARGET_REPO_URL}"
if git remote | grep -q "^repo-b$"; then
  git remote set-url repo-b "$REMOTE_URL"
else
  git remote add repo-b "$REMOTE_URL"
fi

# ---- Fetch target (B) ----
git fetch repo-b "$TARGET_BRANCH"

# ---- Push (fast-forward if possible, otherwise force-align) ----
echo "🚀 Syncing next-block → VaultBackend..."

if git merge-base --is-ancestor "repo-b/${TARGET_BRANCH}" HEAD; then
  git push repo-b "${TARGET_BRANCH}:${TARGET_BRANCH}"
else
  git push repo-b "${TARGET_BRANCH}:${TARGET_BRANCH}" --force-with-lease
fi

echo "✅ VaultBackend is now aligned with next-block"