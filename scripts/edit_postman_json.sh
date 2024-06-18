#!/bin/bash

jq --tab "del(.info._postman_id, .info._exporter_id)" MINT.postman_collection.json > tmp.postman && mv tmp.postman MINT.postman_collection.json