---
title: Security
---

# Encryption and signing

The Egendata solution uses standard algorithms for all encryption and signatures.

## Algorithms

The Egendata solution uses the following encryption algorithms from the [SubtleCrypto interface](https://www.w3.org/TR/WebCryptoAPI/#subtlecrypto-interface)

Algorithm | Description
--- | ---
[AES-128-CBC](https://tools.ietf.org/html/rfc3602) | For symmetric encryption
[RSAES-OAEP](https://tools.ietf.org/html/rfc2437#section-7.1) | For asymmetric encryption (2048 bit key)
[RSASSA-PSS (PS256)](https://tools.ietf.org/html/rfc3447#section-8.1) | For signing (2048 bit key)

## Data storage and transmission

All messages transmitted between Service, Operator and App is sent in the form of JWT and signed with the sender party's own signing key. All Egendata messaging schemas(JWT) contains the property "type" to make it easier for the recipient to easily identify the purpose of the incoming message.

The Egendata solution uses the [Panva](https://github.com/panva/jose) implementation of [JavaScript Object Signing and Encryption](JOSE) as the serialization format for storage and transmission of signed/encrypted data.

The JOSE framework is based upon the following RFCs:

RFC | Description
--- | ---
[JWK](https://tools.ietf.org/html/rfc7517) | JSON Web Key RFC7517, format for encryption keys.
[JWE](https://tools.ietf.org/html/rfc7516) | JSON Web Encryption RFC7516, format för encrypted data. In Egendata solution only the "General JWE JSON Serialization Syntax" is used due to that being the only one supporting multiple recipients. The content is encrypted with "A128CBC-HS256"(link?) and the recipient keys with "RSA-OAP".
[JWS](https://tools.ietf.org/html/rfc7515) | JSON Web Signature RFC7515, format for signed data. All data is signed before being encrypted. This allows the validation of the data source.
[JWT](https://tools.ietf.org/html/rfc7519) | JSON Web Token RFC7519, format for transmission of claims between all parts of the Egendata solution. 

Data saved in a user's PDS is always represented as JWE.

## Trust establishment

All communication with the Operator is established via TLS (although not enforced).

The Egendata signature validation is grounded in the fact that the signee service has a valid certificate issued from a trusted CA. The recipient of an incoming message, queries the supposed signee service(sub) to obtain the signee’s public key. Through secure TLS connection it trusts that it's in contact with the correct signee service and therefore also trusts the received public key. The signee's public key is then used for validation of the signature to ensure that said proposed service is the issuer and signee the received data.

This kind of signature verification also occurs when services consume data produced by other services.

## Egendata messages properties and purposes


### SERVICE_REGISTRATION
_This is the message sent to the operator by a service, when the later registers itself._

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE_GOES_HERE_
`type` | _Defines the type of the message sent._
`displayName` | _The name the service wants to display to users._
`description` | _The description the service wants to display to the users._
`iconURI` | _Relative or actual URI of the icon the service wants to display to the users._
`jwksURI` | _The main URI linked to the service. It will also be used as the service’s id in the database._
`eventsURI` | _The URI the service will be receiving event responses._

---

### ACCOUNT_REGISTRATION
__

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`pds` | _PURPOSE-GOES-HERE_
`- pds.provider` | _PURPOSE-GOES-HERE_
`- access_token` | _PURPOSE-GOES-HERE_

---

### AUTHENTICATION_REQUEST
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`sid` | _PURPOSE-GOES-HERE_
`eventsURI` | _PURPOSE-GOES-HERE_

---

### CONNECTION_INIT
_Initiates a connection between the user and the service. Is triggered when there is no pre-existing connection between these two parties._

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`sid` | _PURPOSE-GOES-HERE_

---

### LAWFUL_BASIS
_Defines the reasons the service needs to request each piece of data from the user. Is defined when the service is registered. Unless specified otherwise this is allows consent to the areas._

---

### CONTENT_PATH
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`domain` | _PURPOSE-GOES-HERE_
`area` | _PURPOSE-GOES-HERE_

---

### PERMISSION_BASE
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...CONTENT_PATH` | _PURPOSE-GOES-HERE_
`id` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._ 
`lawfulBasis` | _PURPOSE-GOES-HERE_

---

### READ_PERMISSION_REQUEST
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...PERMISSION_BASE` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`purpose` | _PURPOSE-GOES-HERE_
`jwk` | _PURPOSE-GOES-HERE_

---

### WRITE_PERMISSION_REQUEST
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...PERMISSION_BASE` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`description` | _PURPOSE-GOES-HERE_

---

### PERMISSION_REQUEST_ARRAY
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`READ_PERMISSION_REQUEST` | _PURPOSE-GOES-HERE_
`WRITE_PERMISSION_REQUEST` | _PURPOSE-GOES-HERE_

---

### READ_PERMISSION
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...PERMISSION_BASE` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`purpose` | _PURPOSE-GOES-HERE_
`kid` | _PURPOSE-GOES-HERE_

---

### WRITE_PERMISSION
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...PERMISSION_BASE` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`description` | _PURPOSE-GOES-HERE_
`jwks` | _PURPOSE-GOES-HERE_

---

### PERMISSION_ARRAY
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`READ_PERMISSION` | _PURPOSE-GOES-HERE_
`WRITE_PERMISSION` | _PURPOSE-GOES-HERE_

---

### PERMISSION_DENIED
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...PERMISSION_BASE` | _PURPOSE-GOES-HERE_

---

### PERMISSION_REQUEST
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`permissions` | _PURPOSE-GOES-HERE_
`sub` | _PURPOSE-GOES-HERE_
`sid` | _PURPOSE-GOES-HERE_

---

### CONNECTION_REQUEST
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`permissions` | _PURPOSE-GOES-HERE_
`sid` | _PURPOSE-GOES-HERE_
`displayName` | _PURPOSE-GOES-HERE_
`description` | _PURPOSE-GOES-HERE_
`iconURI` | _PURPOSE-GOES-HERE_

---

### CONNECTION
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`sid` | _PURPOSE-GOES-HERE_
`sub` | _PURPOSE-GOES-HERE_
`permissions` | _PURPOSE-GOES-HERE_
`- approved` | _PURPOSE-GOES-HERE_
`- denied` | _PURPOSE-GOES-HERE_

---

### CONNECTION_RESPONSE
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`payload` | _PURPOSE-GOES-HERE_

---

### CONNECTION_EVENT
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`payload` | _PURPOSE-GOES-HERE_

---

### LOGIN
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`sid` | _PURPOSE-GOES-HERE_
`sub` | _PURPOSE-GOES-HERE_

---

### LOGIN_RESPONSE
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`payload` | _PURPOSE-GOES-HERE_

---

### LOGIN_EVENT
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`payload` | _PURPOSE-GOES-HERE_

---

### ACCESS_TOKEN
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`sub` | _PURPOSE-GOES-HERE_

---

### DATA_READ_REQUEST
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`sub` | _PURPOSE-GOES-HERE_
`paths` | _PURPOSE-GOES-HERE_
`- domain` | _PURPOSE-GOES-HERE_
`- area` | _PURPOSE-GOES-HERE_

---

### DATA_READ_RESPONSE
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`sub` | _PURPOSE-GOES-HERE_
`paths` | _PURPOSE-GOES-HERE_
`- ...CONTENT_PATH` | _PURPOSE-GOES-HERE_
`- data` | _PURPOSE-GOES-HERE_
`- error` | _PURPOSE-GOES-HERE_
`- - message` | _PURPOSE-GOES-HERE_
`- - status` | _PURPOSE-GOES-HERE_
`- - code` | _PURPOSE-GOES-HERE_
`- - stack` | _PURPOSE-GOES-HERE_

---

### DATA_WRITE
_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
`...JWT_DEFAULTS` | _PURPOSE-GOES-HERE_
`type` | _Defines the type of the message sent._
`sub` | _PURPOSE-GOES-HERE_
`paths` | _PURPOSE-GOES-HERE_
`- ...CONTENT_PATH` | _PURPOSE-GOES-HERE_
`- data` | _PURPOSE-GOES-HERE_

## Steps performed upon writing to PDS.

### At the service

1. When a service wants to write to a user’s PDS, a JWT message of type "DATA_WRITE" is constructed with the following inputs are required: "domain", "area" and optionally "data"(JWE). A "DATA_WRITE" without any data is essentially the same as clearing the data located at the “content path” of the user’s PDS.
1. First a signing key(JWK) is constructed based upon the "domain" and "area" (This is not fully implemented and instead the service's own private key(from the client configuration) is used).
1. The "data" is signed with the service's private key and represented as an JWS object.
1. A JWE is then constructed based upon the JWS and each read permissioned recipient.
1. Finally the JWE is packed into a JWT and transmitted over to the Operator.

### At the operator

1. The Operator receives the incoming message(JWT) and validates the integrity of the message(JWT signature verification).
1. After that, the Operator performs queries to its own database based upon the JWT properties "sub", "iss", "domain" and "area" of each "content path" entry. (See the Egendata messaging schemas...)
1. If valid write permissions are found by the queries, the query result contains details about the "pdsProvider" and "pdsCredentials".
1. The destination PDS directory path is defined based upon "connectionId", "domain" and "area".
`/data/${encodeURIComponent(connectionId)}/${encodeURIComponent(domain)}/${encodeURIComponent(area)}/data.json`
1. The JWE(encrypted at the service) of the received JWT, is extracted and written to the users PDS and a successful status code 201 is returned to the service, alternatively 403 upon error.

## Steps performed upon reading from PDS

### At the service

1. The Service constructs a JWT message ("DATA_READ_REQUEST") with desired "content paths" and a connectionId(sub).
1. The message(JWT) is transmitted to the Operator.

### At the operator

1. The Operator receives the incoming message(JWT) and performs a lookup in its database to verify that the requesting Service has sufficient read permissions for a user’s PDS.
1. If valid sufficient read permissions are found, the database query result contains details about the "pdsProvider" and "pdsCredentials".
1. The Operator constructs the "content path" strings that locate the data within the user's PDS. `/data/${encodeURIComponent(connectionId)}/${encodeURIComponent(domain)}/${encodeURIComponent(area)}/data.json`
1. The data(JWE) is read from the user's PDS, packed into a new JWT message of type "DATA_READ_RESPONSE" and finally transmitted back to the requesting Service.

### At the service

1. The service receives the incoming message(JWT) and iterates through all listed "content paths"
    1. The Service inspects the JWE and locates its own "Recipient" key.
    1. The Service obtains the required decryption key for the encrypted data, through decrypting its own "Recipient" entry with it's own private key.
    1. The JWE is then decrypted with the decryption key.
1. All "content paths" are returned with decrypted data, alternatively error if something went wrong in the previous step.

:warning: Ask/Check if the Service's received message contains all intended Recipients or just a single one.

## Future plans / Suggestions

We see possibilities to use the ASE-256-CBC for symmetric encryption.
There are no current plans to migrate to ECDSA for signing.

Eventually signing key rotation is expected to be implemented, so that each message can be validated against the public key announced by sending party. The exception is the App, which is not acting as a Webserver, and therefore can't publically announce its own public key, instead the public key is included in the message.

!!! Is there ANY cases where the App initiates a message directly to the Service? That message could potentially be tampered with. Yes, as far as we identified we can see that the CONNECTION_INIT message is transmitted directly to the Service if the App(device) doesn’t have an (cached) existing record of connection with the Service.

!!! Currently TLS is not enforced by the Egendata solution but it should probably be.

!!! The data producer signature verification is intended to be implemented in the Client library, however it's not yet implemented, see: [GitHub Client](https://github.com/egendata/client/blob/master/lib/data.js#L74).

There are potential optimizations to be done in the Panva JOSE library regarding the contruction and decryption the JWT's JWE content, e.g. the extraction of the correct key from the recipient list and to reuse of the same encryption key(but always with unique IV).

## Other

! The Example project uses "Client" (and indirectly "Messaging") library
! The Operator uses "Messaging" library
! The App uses "Messaging" library
! Describe the purpose of the "Messaging" library.
! Describe the purpose of the "Client" library, and update the current Readme.


---------------

# Data structures & storage

- The user’s data is stored in a json “blob” format. 

- No data structure has been defined for the user’s data. It instead keeps the tags of the form it was generated in as the field names. This means that the service dictates the structure of the data that is generated and consumed by it, as well as stored in the PDS.

- The only data stored in the operator is the database records of (registered) users, services, their connections and consents given. This database schema is set up by the scripts in the “migrations” folder of the operator. One of those scripts generates a table called “pgmigrations” that holds the information about when and how (successfully or not) the other tables were generated.
- The account data is stored in the operator in a postgres database.
- Information stored (keys and cached permissions) on the user’s phone is stored in the sync local storage of the device.
- In the current implementation of Egendata, when the user selects to store their data in memory, the data is stored in the internal memory of the operator. This includes and is limited to the data generated by the user in the different services.

# Step-by-step for data generation

## Registering of a service

The following messages are required to establish a service as registered:

- SERVICE_REGISTRATION sends a message containing the information describing the service.
- LAWFUL_BASIS contains information about the reason the service requires to read the data from the user.
- PERMISSION_BASE contains information about the reason the service will request permission to the different areas of the user’s profile.

## Registering a user
When a user is registering the following information is being generated and sent to the operator:

- ACCOUNT_REGISTRATION the user’s device generates a unique id and sends it, as part of the message, to the operator, who prefixes it to the account.

## Logging in to a service with Egendata

In this step we need to consider if the user has an already established connection or not with the service they are trying to log in to. In both cases the process starts by scanning the QR  code of the service with the user’s device. After the QR code is scanned and until the following steps are completed the browser that housed the QR code starts polling the Operator for an ACCESS_TOKEN.

### With an established connection

In this case, the user’s device recognises that there is an existing connection with this service stored in the App’s internal cache and the following messages are triggered:

1. A LOGIN_RESPONSE containing a serialized JWS LOGIN as payload is sent to the operator. This LOGIN_RESPONSE contains the user’s ID as the subject(iss?), and the service as a string in the body(within the LOGIN).
1. The operator extracts the LOGIN from the LOGIN_RESPONSE a wraps it in a new  LOGIN_EVENT message and forwards the message to the service. This happens so the service doesn’t get access to the user’s ID.

### Without an established connection
If this user’s device does not recognise the service then the following messages are triggered:

1. A CONNECTION_INIT is sent from the user’s device directly to the service’s `/events` endpoint.
1. The service responds with a CONNECTION_REQUEST to the user’s device.
1. The CONNECTION_REQUEST might optionally contain a PERMISSION_REQUEST_ARRAY detailing all the areas it is requesting access from the user’s profile. 
1. If the PERMISSION_REQUEST_ARRAY is missing, at the moment, there is no way to send this in a later stage in the communication. There is no error handling for this eventuality and it will result in the system not working, because it will find a null string where it is expecting a not null string.
1. Each PERMISSION_REQUEST in the PERMISSION_REQUEST_ARRAY contains a LAWFUL_BASIS. In the current implementation this is defaulted to consent unless specified otherwise.
1. For read permissions the read key is sent alongside the permission, in the form of a kid. 
1. The description of a write permission could be the schema that needs to be followed. Although, this is not implemented.
1. The key used in the write permissions is the public key derived by the private key sent through a read permission. Instead the path to the jwks is attached. The jwks contains the public keys of the user and the service, that are needed to read and write stuff.
1. After receiving the CONNECTION_REQUEST the device generates a CONNECTION wrapped in a CONNECTION_RESPONSE that is sent to the operator.
1. The operator upon receiving the CONNECTION_RESPONSE extracts from it the CONNECTION and rewrapes it in a CONNECTION_EVENT that is sent to the service. 

# Reading data from PDS

For this process the operator accesses the user’s pds and reads the data requested by the service, as defined by the domain and area sent in though a <>. This means that a service could request data from other services by including another service’s domain in the <> message. 

- The domain defined in the request in the services ID, which is the URI of the service.
- The areas that are defined in the request are the different areas of the CV.
- The response to the request is sent with a <> message for each path requested. This means that for each domain and area path that has been requested the data stored in that folder is sent to the service separately.
- These responses are sent encrypted and then decrypted by the client library.

# Writing data to a PDS

For this process the domain, are and data that needs to be written are sent with a <> message. 
The data are encrypted before being sent to the operator, and then written to the PDS. 
If there is a permission for writing to the user’s PDS the operator writes the data to the PDS. If there is no such permission.
Since all of the data are handled with one message, if even one of the areas is missing a write permission, the operation fails and the data is discarded.

## Configuration properties for Client library

This section describes each configuration property of the Client library.

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

# KeyProvider (Client)

The KeyProvider class is responsible for keeping track of known keys and tokens.

A configuration object must be passed into the KeyProvider constructor upon initialization.
There are 5 configuration properties that affect the construction of the KeyProvider object.

  - `config.clientKey`
  - `config.keyValueStore`
  - `config.keyOptions`
  - `config.jwksURI`
  - `config.alg`

The `KeyProvider` will utilize the `keyValueStorage` property to read and write from/to an external storage. E.g. The Egendata Example-CV service provides an adapter for a locally hosted the redis database. The `KeyProvider` will utilize and assume that three functions are defined in the referenced `KeyValueStore` object: `save(key, value, ttl)`, `load(key)` and `remove(key)`. 

Values written by the Client to the external/referenced `KeyValueStore` are base64 encoded.

The Client signing key(aka. `clientKey`) is provided through the configuration parameter upon initialization of the `Client`. This client key is used for all signing done by this Client, however there are ideas to implement different signing keys for different domains/areas and/or key rotation.

## Prefixes defined in Client library

```
const KEY_PREFIX = 'key|>'
const WRITE_KEYS_PREFIX = 'permissionId|>'
const AUTHENTICATION_ID_PREFIX = 'authentication|>'
```

## Saving key to keyValueStore

`${KEY_PREFIX}${key.kid}`: key

## Saving write keys to keyValueStore:

`${WRITE_KEYS_PREFIX}${domain}|${area}`: jwks

## Saving authentication token to keyValueStore

`${AUTHENTICATION_ID_PREFIX}${sid}`: accessToken
