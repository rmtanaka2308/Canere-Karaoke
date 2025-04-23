#!/bin/bash

cd canere-backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
deactivate
cd ..

cd canere-frontend
npm run dev

kill $BACKEND_PID
