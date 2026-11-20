# Faceless Shorts Cloud Render

Offloads heavy rendering (Chrome capture, ffmpeg, Kokoro voice, Whisper) to GitHub Actions.

## Setup
1. Revoke any token pasted in chat; create a new PAT with `repo` + `workflow` scopes.
2. Store it locally: `export GITHUB_TOKEN=ghp_...` (never commit).
3. Repo: khizar3125/faceless-shorts-cloud

## Trigger a render
```bash
export GITHUB_TOKEN=ghp_...
bash scripts/cloud_render.sh deep-dive my-short voice false
```
Or use GitHub UI: Actions -> Faceless Short Render -> Run workflow.

## Add your own project
Put project under `projects/<name>/` (script.json + src/shots.js), commit & push. Workflow auto-renders on push.

## Download
Artifacts (30-day) and Releases (permanent MP4) on the repo page.
