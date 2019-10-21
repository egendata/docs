# Egendata - Documentation

[![Build Status](https://travis-ci.com/egendata/docs.svg?branch=master)](https://travis-ci.com/egendata/docs)

The documentation is online, and can be found at: [https://egendata.github.io/docs](https://egendata.github.io/docs)

## Pre-requisites

Install the [Hugo site generator](https://gohugo.io/getting-started/installing)

## Run the site

```bash
hugo server
```

Visit http://localhost:1313

## Build

```bash
hugo
```

## Fetch readme pages from GitHub

```bash
npm install
npm run github
```

The static site ends up in `./public`

## Contributing

Changes to the documentation are made to [/content](./content).
When a change is pushed to master, either via a direct push, or via a PR, Travis builds a new version of the docs.
The new build (and only the build) is then deployed to the branch [gh-pages](https://github.com/egendata/docs/tree/gh-pages) in order to keep the commit-history on `master` clean.
