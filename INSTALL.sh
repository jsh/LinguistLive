#!/bin/bash -e

die() { echo "$@"; exit -1; }  # utility function

npm install --quiet  # installs all the dependencies

[ -n "$GEMINI_API_KEY" ] || {   # is GEMINI_API_KEY set and exported? If not:
	echo
	echo "You need a GEMINI_API_KEY:"
	echo "  (1) browse to https://aistudio.google.com"
	echo "  (2) Click on 'Get API key' in the left-hand sidebar"
	echo "  (3) Click the blue button labeled 'Create API key' and follow steps to create one."
	echo "  (4) Copy the key into your paste buffer"
	echo
	echo "Now set the environment variable GEMINI_API_KEY to this value, and export the variable:"
	echo "  export GEMINI_API_KEY='AIza...'"
	echo
	die "After you have finished, re-run this script."
    }

npm run dev  # launch the app
