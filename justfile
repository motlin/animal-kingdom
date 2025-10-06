# `just --list --unsorted`
[group('default')]
default:
    @just --list --unsorted

[group('build')]
build:
    rm -rf dist
    mkdir -p dist
    cp index.html dist/
    cp logo.png dist/
    cp styles.css dist/

[group('dev')]
serve:
    python3 -m http.server 8000

[group('build')]
precommit:
    npm run format
    npm run ci:typecheck
    npm run test:run
    npm run build
