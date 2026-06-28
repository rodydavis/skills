#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

echo -e "${YELLOW}Starting Android Kotlin compilation check...${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$(dirname "$SCRIPT_DIR")")")"
ANDROID_DIR="$PROJECT_ROOT/android"

if [ ! -d "$ANDROID_DIR" ]; then
    echo -e "${RED}Error: android directory not found at $ANDROID_DIR${NC}"
    exit 1
fi

echo "Running gradle compileDebugKotlin..."
set +e
"$ANDROID_DIR/gradlew" -p "$ANDROID_DIR" compileDebugKotlin --quiet

RESULT=$?
set -e

if [ $RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ Android Compilation Succeeded! No errors found.${NC}"
    exit 0
else
    echo -e "${RED}✗ Android compilation failed with exit code $RESULT.${NC}"
    exit $RESULT
fi
