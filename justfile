# `just --list --unsorted`
[group('default')]
default:
    @just --list --unsorted

[group('dev')]
dev:
    npm run dev

[group('dev')]
preview:
    npm run preview

[group('dev')]
test:
    npm run test

[group('build')]
build:
    npm run build

[group('ci')]
typecheck:
    npm run ci:typecheck

[group('ci')]
lint:
    npm run lint

[group('ci')]
format:
    npm run format

[group('ci')]
format-check:
    npm run ci:biome
    npm run ci:prettier

[group('ci')]
test-once:
    npm run test:run

[group('ci')]
ci: format-check typecheck test-once build

[group('build')]
precommit:
    npm run format
    npm run ci:typecheck
    npm run test:run
    npm run build
