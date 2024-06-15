#!/bin/sh -e
curl -X GET "http://localhost/api/v1/openapi.json" > frontend/openapi.json

(cd frontend; node modify-openapi-operationids.js; npm run generate-client)
