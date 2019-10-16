---
title: Client
---

The Client library serves to alleviate the Egendata integration complexity for [Service](#) providers.

For reference, the following example sites utilize the Client library:

- [Example CV](https://github.com/egendata/example-cv)
- [MySkills API](https://github.com/JobtechSwe/myskills-api)

## Usage

The Client library is distributed via the NPM software registry and can be installed with:

```bash
npm install @egendata/client
```

Import and start using the Client library:

```js
const client = require('@egendata/client');

// A key-value based storage module that implements the required interface methods listed below:
//   * keyValueStore.save(key, value, ttl)
//   * keyValueStore.load(key)
//   * keyValueStore.remove(key)
const keyValueStore = require('../services/keyValueStore')

// An example Client configuration
const config = {
  displayName: 'My service',
  description: 'A service that integrates with Egendata',
  iconURI: 'http://my-service-domain.com/icon.png',
  clientId: process.env.CLIENT_ID,
  operator: process.env.OPERATOR_URL,
  jwksPath: '/jwks',
  eventsPath: '/events',
  clientKey: process.env.PRIVATE_KEY,
  keyValueStore: keyValueStore,
  defaultPermissions: [
    {
      area: 'baseData',
      types: ['READ', 'WRITE'],
      purpose: 'Purpose of requesting permission.',
      description: 'Short description of requested permission.'
    }
  ]
}

// Create the Client which will be used all communication with Egendata Operator.
client.create(config)
```

## Client configuration properties

Configuration property | Data type | Purpose
--- | --- | ---
`displayName` | `string` | _Name of this service/application_
`description` | `string` | _A short description of this Service_
`iconURI` | `string` | _A URI to this service's logotype/icon_
`clientId` | `string` | _This is the identifier which this service will use to identify/register itself to the Operator with. Typically this will be the public `https://domain:port` this service is hosted on_
`operator` | `string` | _This is field specifies the `https://domain:port` to the central Operator service._
`jwksPath` | `string` | _This field specifies where this service's JWKS is exposed/found, e.g. `/jwks`_
`clientKey` | `string` | _This field specifies the private key(`PEM`/`JWK`) this service will use for encrypting- and signing of data._
`keyValueStore` | `object` | _A reference to an object/adapter which can read, write and remove data to/from a storage. The keyValueStore must implement the following interface: `keyValueStore.save(key, value, ttl)`, `keyValueStore.load(key)` and `keyValueStore.remove(key)`._
`defaultPermissions` | `array` | _An array of desired read/write permissions_
`defaultPermissions.#.area` | `string` | _An area describes where in the user's PDS to store/read data from, e.g. `baseData` or `experiences`_
`defaultPermissions.#.types` | `array` | _An array that denotes which types of permissions are desired for this specific area. e.g. `['READ']`, `['WRITE']` or both `['READ', 'WRITE']`_
`defaultPermissions.#.purpose` | `string` | _A short purpose description of why this service requests this specific read/write permission, e.g. `'In order to create a CV using our website.'`_
`defaultPermissions.#.description` | `string` | _A short description of the area this permission request relates to, e.g. `'Personal information.'`

## Key Provider

The KeyProvider class is responsible for keeping track of known keys and tokens.

A configuration object must be passed into the KeyProvider constructor upon initialization.
There are 5 configuration properties that affect the construction of the KeyProvider object.

  - `config.clientKey`
  - `config.keyValueStore`
  - `config.keyOptions`
  - `config.jwksURI`
  - `config.alg`

The `KeyProvider` will utilize the `keyValueStorage` property to read and write from/to an external storage. E.g. The Egendata Example-CV service provides an adapter for a locally hosted the Redis database. The `KeyProvider` assumes that three functions are defined in the referenced `KeyValueStore` object:

- `keyValueStorage.save(key, value, ttl)`
- `keyValueStorage.load(key)`
- `keyValueStorage.remove(key)`

All values written by the KeyProvider to the external/referenced `KeyValueStore` are base64 encoded.

The Client signing key(aka. `clientKey`) is provided through the configuration parameter upon initialization of the `Client`. This client key is used for all signing done by this Client, however there are ideas to implement different signing keys for different domains/areas and/or key rotation.
