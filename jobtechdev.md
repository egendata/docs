# EgenData

[![Build Status](https://travis-ci.com/JobtechSwe/mydata.svg?branch=master)](https://travis-ci.com/JobtechSwe/mydata)
[![Test Coverage](https://api.codeclimate.com/v1/badges/58e30cd7d55d0c0bed1a/test_coverage)](https://codeclimate.com/github/JobtechSwe/mydata/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/58e30cd7d55d0c0bed1a/maintainability)](https://codeclimate.com/github/JobtechSwe/mydata/maintainability)

## Bakgrund

MyData is a movement that strive for individuals to have control over their own data. EgenData is an implementation of the 'MyData' principles. The goal for EgenData is to facilitate innovation within the Swedish labor market. With EgenData we want to test the hypothesis that it is possible to create a distributed and decentralized CV-data storage. Read/ write access to the storage  should be made available to all interested parties under the controll and consent of the data owner.

## Purpose and Goal

### Protect individual's right over their data (MyData movement)

We believe that having access to people's data creates opportunities for new products and services. It therefore has the potential to create value to the society. However, data can also be used used, for example to monitor or influence opinions for political purposes. Access to individuals' data by few can lead to information monopoly and ultimatelly to a concentration of power. We believe that a way to mitigate this risk would be to give the control of the data back to their owners.


### Community building and innovation

Our second goal is to enable innovation in the society. Companies and authorities should be able to work more efficiently and to develop powerful digital services as startups do. Private and public organizations should be able to collaborate to increase the social benefit and do so by using a common digital infrastructure and standards. By enabling a “digital bureaucracy”, ie traceability and standardized communication, new forms of governance can be established which are more transparent and effective. We do this primarilly to boost competitiveness for Sweden and the EU, but what we do can become a standard to increase societal benefits for all. Open Source is a global movement and has the power to improve the way we do things for both small and large organizations and countries.

### Promote the labour market

We want to simplify the labour market and to increase its efficiency by catalyzing the ecosystem around Jobtech Development. We strive to facilitate the creation of new and improved services for both job seekers and employers; a free and effective cross-border mobility within the EU; to reduce employement costs and to simplify the 'job-seeking' experience for individuals.

## Methodology

An innovation team has been created that consists of expertise in programming, UX, infrastructure, encryption / security and expertise from the authority. The innovation team works iteratively and should achieve higher and higher goals / milestones. The first stage, for example, is to get all the system components in place but with very limited functionality. Then we will increase the complexity and finally we will release an embryo of the product that can be evaluated by the community.

## Transparency and cooperation

We aim to be 100% transparent and publish all code and documentation here on Github. The intention is to consolidate knowledge and increase cooperation with other initiatives that simultaneously work with the same idea. We are very happy to get in touch with you and are happy to share our lessons-learned and to learn from you. The project's Kanban board where the developers coordinate the work can be viewed here https://trello.com/b/uGsJAcH1/mydata-mvp

## The code

By visualizing and practically showing how ownership of their own data could work, it becomes easier to have opinions on the concept. We would like to 'reuse' as much as possible and not to reinvent the wheel. The project is influenced by [mydata.org] (http://mydata.org)

The project is divided into several parts:

- [Egendata-app](https://github.com/egendata/app) : is a phone app where the individual handles the sharing of their data
- [Egendata-operator](https://github.com/egendata/operator) : is a technical hub that, given the approval of the individual, handles the communication between the individual, his data and the services that want to use the data;
- [Egendata-client](https://github.com/egendata/client) : is an [npm-package](https://www.npmjs.com/package/@egendata/client) used by services to communicate with `operator`. It allows signing, encryption, validation and sending of messages and data;
- [Egendata-cv](https://github.com/egendata/example-cv) : is the service that handles personal data. It allows to read & write to the personal data after being given permission to do so;
- [Egendata-national-registration](https://github.com/egendata/example-national-registration) : is a service that certifies something about the user (in this case that the user is a specific person). The service writes (only) to the personal data after being granted permission to do so;
- [messaging](https://github.com/egendata/messaging) : is an [npm-package](https://www.npmjs.com/package/@egendata/messaging) for internal use with functions that are shared between `client`,` operator`, `app` and` e2e`. It includes, for example, functions to validate the format of messages and to handle cryptographic tokens;
- [e2e](https://github.com/egendata/e2e) : contains end-to-end and integration tests for the project.

Data is stored encrypted in a so-called PDS (Personal Data Storage). Right now, data storage is supported in the user's dropbox account and in the memory of the operator (for easy testing).

## Install and develop

1. Clone this repo
2. `npm ci`
3. `docker-compose up` will start all databases and other services needed by all the sub-projects
4. Look in each subfolder for instructions on how to start the sub-projects

**Before pushing/PR:**
Do `npm test` (this will lint, run unit tests and run e2e/integration tests)
