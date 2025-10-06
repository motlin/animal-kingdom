# `just --list --unsorted`
[group('default')]
default:
    @just --list --unsorted

build:
    rm -rf dist
    mkdir -p dist
    cp index.html dist/
    cp logo.png dist/
    cp styles.css dist/

serve:
    python3 -m http.server 8000
