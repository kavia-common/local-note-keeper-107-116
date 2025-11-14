#!/bin/bash
cd /tmp/kavia/workspace/code-generation/local-note-keeper-107-116/note_taking_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

