#!/bin/bash
# Trigger a cloud render on GitHub Actions and (optionally) download the MP4.
# Usage:
#   bash scripts/cloud_render.sh <style> <short-name> [voice|estimate] [draft]
# Env (required): GITHUB_TOKEN, GITHUB_REPO (default khizar3125/faceless-shorts-cloud)
set -eu
STYLE="${1:?style}"; NAME="${2:?short-name}"; MODE="${3:-voice}"; DRAFT="${4:-false}"
REPO="${GITHUB_REPO:-khizar3125/faceless-shorts-cloud}"
TOKEN="${GITHUB_TOKEN:?set GITHUB_TOKEN (never commit it)}"
API="https://api.github.com/repos/$REPO"
echo "Triggering render: style=$STYLE name=$NAME mode=$MODE draft=$DRAFT"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
  "$API/actions/workflows/render.yml/dispatches" \
  -d "{\"ref\":\"main\",\"inputs\":{\"style\":\"$STYLE\",\"short_name\":\"$NAME\",\"mode\":\"$MODE\",\"draft\":$DRAFT}}" >/dev/null
echo "Triggered. Opening runs list..."
echo "https://github.com/$REPO/actions"
# Poll for completion
RUN_ID=""
for i in $(seq 1 60); do
  sleep 10
  RUN_ID=$(curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" "$API/actions/runs?per_page=1" | python3 -c "import sys,json; print(json.load(sys.stdin)['workflow_runs'][0]['id'])" 2>/dev/null)
  STATUS=$(curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" "$API/actions/runs/$RUN_ID" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['status'], d.get('conclusion'))" 2>/dev/null)
  echo "run $RUN_ID: $STATUS"
  echo "$STATUS" | grep -q "completed" && break
done
echo "Artifacts: $API/actions/runs/$RUN_ID/artifacts"
echo "Release: https://github.com/$REPO/releases"
