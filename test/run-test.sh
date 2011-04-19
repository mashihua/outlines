#!/bin/sh

VERSION=`cat ../version`
echo 'running outlines '$VERSION' tests'

java  -cp env.js/rhino/js.jar  \
    org.mozilla.javascript.tools.shell.Main -opt -1\
		test-outlines.js