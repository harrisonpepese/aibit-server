#!/bin/bash
# Script to run the event-based movement system test

cd $(dirname $0)/..
echo "Running event-based movement system test..."
npx ts-node src/movement/test-event-movement.ts
