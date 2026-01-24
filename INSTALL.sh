#!/bin/bash -e

die() { echo "$@"; exit -1; }                                                           # print error message and die

npm_installed() {                                                                       # install npm if needed
    type -t npm ||
        case $(uname -s) in
            Linux)
                sudo apt-get update -y -qq &&                                           # apt package mgr
                    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq npm
            ;;
            Darwin) brew install npm ;;                                                 # Homebrew package mgr
            *) false ;;                                                                 # anything else, just bail
        esac
} > /dev/null

api_key_present() {                                                                     # is GEMINI_API_KEY set and exported?
    [ -n "$GEMINI_API_KEY" ]
}

api_key_instructions() {
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
    echo "then re-run this script."
}

npm_installed || die "Install npm, then re-run this script."

api_key_present || die "$(api_key_instructions)"

npm install --quiet &> /dev/null                                                        # install all the dependencies

npm run dev  # launch the app
