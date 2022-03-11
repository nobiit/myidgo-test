#!/bin/bash
TAG=elofun/repo:vds-web-$1
docker build . -t $TAG
docker push $TAG