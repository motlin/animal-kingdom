# `just --list --unsorted`
[group('default')]
default:
    @just --list --unsorted

# `npm install`
[group('setup')]
install:
    npm install

# `npm ci`
install-ci:
    npm ci

# `npm run dev`
dev: install
    npm run dev

# `npm run oxlint`
oxlint: install
    npm run oxlint

# `npm run oxlint:ci`
oxlint-ci: install-ci
    npm run oxlint:ci

# `npm run format`
format: install
    npm run format

# `npm run ci:biome`
biome-ci: install-ci
    npm run ci:biome

# `npm run ci:prettier`
prettier-ci: install-ci
    npm run ci:prettier

# `npm run test:run`
test: install
    npm run test:run

# `npm run test:run`
test-ci: install-ci
    npm run test:run

# `npm run ci:typecheck`
typecheck: install
    npm run ci:typecheck

# `npm run ci:typecheck`
typecheck-ci: install-ci
    npm run ci:typecheck

# `npm run build`
build: install
    npm run build

# `npm run build`
build-ci: install-ci
    npm run build

# `npm run storybook`
storybook: install
    npm run storybook

# `npm run build-storybook`
build-storybook: install
    npm run build-storybook

# Run all pre-commit checks
precommit: format oxlint typecheck build test
    @echo "✅ All pre-commit checks passed!"
