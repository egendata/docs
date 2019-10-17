---
title: Infrastructure
---

## Documentation for the Infrastructure of Egendata repositories

Before you begin, this guides assume that...

- ...you have access to the [OpenShift cluster](https://console.dev.services.jtech.se:8443/) or have a functioning OpenShift cluster
- ...you are familiar with OpenShift (and Kubernetes) and have the [OpenShift CLI installed](https://docs.openshift.com/container-platform/3.7/cli_reference/get_started_cli.html#installing-the-cli) version 3.x
- ...you have access to the `mydata` project namespace inside OpenShift (if you use the above existing cluster)
- ...you have access to the [Github organization](https://github.com/egendata)
- ...you are familiar with [Travis CI](https://travis-ci.com/) that is used for automating the CI process
- ...you are familiar with [conventional commits or semantic commit messages](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#summary) and [semantic-release](https://github.com/semantic-release/semantic-release) that we use for automating the package release workflow based on the commit messages
- ...you have access to the [Dockerhub organization](https://cloud.docker.com/u/jobtechswe/repository/list) where we push the Docker images for services that run in OpenShift
- ...you have access to the [NPM organization](https://www.npmjs.com/settings/egendata/packages)

Go ahead and get familiar with the things above, make sure you have access to OpenShift and Github and let's start.

{{% children %}}