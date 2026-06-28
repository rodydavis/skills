#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

echo -e "${YELLOW}Starting iOS compilation check...${NC}"

if [ -d "/Applications/Xcode-16.2.app" ]; then
    echo "Using Xcode 16.2 toolchain..."
    export DEVELOPER_DIR="/Applications/Xcode-16.2.app/Contents/Developer"
else
    echo "Using system default Xcode toolchain..."
fi

echo "Running xcodebuild..."
set +e
xcodebuild \
  -workspace ios/Runner.xcworkspace \
  -scheme Runner \
  -configuration Debug \
  -sdk iphonesimulator \
  build \
  -quiet

RESULT=$?
set -e

if [ $RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ iOS Compilation Succeeded! No errors found.${NC}"
    exit 0
else
    echo -e "${YELLOW}Xcode build finished with code $RESULT.${NC}"
    echo "If the only failing step in the output is 'CompileAssetCatalog', your Swift and interop codebase compiles successfully."
    exit $RESULT
fi
