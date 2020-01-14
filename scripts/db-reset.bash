#!/bin/bash

if [[ -z "${NODE_ENV}" ]]; then
	echo "db not specified"
else
	mongo test --eval "db.dropDatabase()"
fi
