#!/bin/bash

cd -
tsc src/*.ts --module amd
cp src/*.js www/scripts/helper/