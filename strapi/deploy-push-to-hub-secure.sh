#!/bin/bash
# deploy-push-to-hub-secure.sh — build the image and push it to Docker Hub.
# The same script in every Timebars image repo; only IMAGE (and BUILD_ARGS) differ.
#
# Tag = build date, e.g. 2026.10.12 (a second build that day: 2026.10.12-2). Servers pin the tag in
# their .env (deploy.sh writes it); :latest is pushed as well but no server runs it.
# Nothing secret goes into the image: .dockerignore keeps every .env* file out.
#
# Uses the Docker login saved on this machine. Log in once with: docker login -u jimecox807
# (paste the PAT at the prompt). Never put the PAT in a file.
IMAGE=jimecox807/tbblog-strapi
BUILD_ARGS=()

cd "$(dirname "$0")" || exit 1
[ -n "$(git status --porcelain 2>/dev/null)" ] && echo "Note: uncommitted changes are included in this build."

default=$(date +%Y.%m.%d)
read -r -p "Tag (press Enter for $default): " tag
tag=${tag:-$default}

docker build "${BUILD_ARGS[@]}" \
  --label "org.opencontainers.image.revision=$(git rev-parse --short HEAD 2>/dev/null)" \
  -t "$IMAGE:$tag" -t "$IMAGE:latest" . || exit 1

for t in "$tag" latest; do
  if ! docker push "$IMAGE:$t"; then
    echo "Push failed. If it was an auth error, run: docker login -u jimecox807"
    exit 1
  fi
done

echo
echo "Pushed $IMAGE:$tag"
echo "Next: record it in tbown VERSION.md, then on the server: ./deploy.sh and type $tag"
