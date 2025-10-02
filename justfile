default:
    @just --list

build:
    rm -rf dist
    mkdir -p dist
    cp index.html dist/
    cp logo.png dist/

serve:
    python3 -m http.server 8000
