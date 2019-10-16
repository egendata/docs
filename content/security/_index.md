---
title: Security
---

The Egendata solution uses standard algorithms for all encryption and signatures.

## Trust establishment

The [Operator](/operator) acts as the single point of contact for all [Services](/services) and Applications integrated with the Egendata solution.
It is highly recommended that all communication channels with the [Operator](/operator) are established using the [TLS protocol](https://tools.ietf.org/html/rfc5246) (although not enforced).

All [Services](/services) or devices that establish connectivity with the [Operator](/operator) verifies the validity of the [Operator's](/operator) TLS certificate and ensures that it's issued directly/indirectly by a trusted [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority).

## Signature verification

### Signee service

The Egendata signature validation is grounded in the fact that the signee service has a TLS certificate issued from a trusted [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority).

The recipient of an incoming Egendata [Message](/data/#egendata-message-schema-definitions), queries the supposed [Signee Service](#signee-service) to obtain the signee’s public key. Through secure TLS connection it trusts that it's in contact with the correct signee service and therefore also trusts the received public key. The signee's public key is then used for validation of the signature to ensure that said proposed service is the issuer and signee the received data.

This kind of signature verification also occurs when services consume data produced by other services.

## Encryption and signature algorithms

The Egendata solution uses the following encryption algorithms from the [SubtleCrypto interface](https://www.w3.org/TR/WebCryptoAPI/#subtlecrypto-interface)

Algorithm | Description
--- | ---
[AES-128-CBC](https://tools.ietf.org/html/rfc3602) | For symmetric encryption
[RSAES-OAEP](https://tools.ietf.org/html/rfc2437#section-7.1) | For asymmetric encryption (2048 bit key)
[RSASSA-PSS (PS256)](https://tools.ietf.org/html/rfc3447#section-8.1) | For signing (2048 bit key)

## Data storage and transmission

All messages transmitted between Service, Operator and App is sent in the form of JWT and signed with the sender party's own signing key. All Egendata messaging schemas(JWT) contains the property `type` to make it easier for the recipient to easily identify the purpose of the incoming message.

The Egendata solution uses the [Panva](https://github.com/panva/jose) implementation of [JavaScript Object Signing and Encryption](JOSE) as the serialization format for storage and transmission of signed/encrypted data.

The JOSE framework is based upon the following RFCs:

RFC | Description
--- | ---
[JWK](https://tools.ietf.org/html/rfc7517) | JSON Web Key RFC7517, format for encryption keys.
[JWE](https://tools.ietf.org/html/rfc7516) | JSON Web Encryption RFC7516, format för encrypted data. In Egendata solution only the "General JWE JSON Serialization Syntax" is used due to that being the only one supporting multiple recipients. The content is encrypted with "A128CBC-HS256"(link?) and the recipient keys with "RSA-OAP".
[JWS](https://tools.ietf.org/html/rfc7515) | JSON Web Signature RFC7515, format for signed data. All data is signed before being encrypted. This allows the validation of the data source.
[JWT](https://tools.ietf.org/html/rfc7519) | JSON Web Token RFC7519, format for transmission of claims between all parts of the Egendata solution. 

Data saved in a user's PDS is always represented as JWE.

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
