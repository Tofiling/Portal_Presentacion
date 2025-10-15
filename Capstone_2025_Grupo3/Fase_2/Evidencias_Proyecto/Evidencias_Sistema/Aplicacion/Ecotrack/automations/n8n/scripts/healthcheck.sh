#!/usr/bin/env bash
curl -fsSL "http://localhost:${N8N_PORT:-5678}/healthz" && echo "OK" || (echo "FAIL"; exit 1)
