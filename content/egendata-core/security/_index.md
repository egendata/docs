---
title: Security
---

The Egendata solution uses standard algorithms for all encryption and signatures.

## Trust establishment

The [Operator](/operator) acts as the single point of contact for all [Services](/services) and Applications integrated with the Egendata solution.
It is highly recommended that all communication channels with the [Operator](/operator) are established using the [TLS protocol](https://tools.ietf.org/html/rfc5246) (although not enforced).

All [Services](/services) or devices that establish connectivity with the [Operator](/operator) verifies the validity of the [Operator's](/operator) TLS certificate to ensure that it's issued directly/indirectly by a trusted [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority).

Thus communication with the [Operator](/operator) is considered trusted and secure.

{{% notice warning %}}
Due to the Egendata Application not acting as webserver, it is unable to publish its own public key(s). Therefore, recipients are unable to verify the authenticity of Messages issued by the Application. Instead the Application provide its own public key(s) directly embedded in the transmitted message, however this is not sufficient to prove authenticity of the message.

It is, however, possible for the Operator to assert that an account uses one and only one key for signing
its communication. This is currently not enforced.
{{% /notice %}}

## Encryption

The Egendata solution uses the following encryption algorithm(s) from the [SubtleCrypto interface](https://www.w3.org/TR/WebCryptoAPI/#subtlecrypto-interface)

Algorithm | Description
--- | ---
[AES-128-CBC](https://tools.ietf.org/html/rfc3602) | For symmetric encryption
[RSAES-OAEP](https://tools.ietf.org/html/rfc2437#section-7.1) | For asymmetric encryption (2048 bit key)

## Signatures

The Egendata solution uses the following signature algorithm(s) from the [SubtleCrypto interface](https://www.w3.org/TR/WebCryptoAPI/#subtlecrypto-interface)

Algorithm | Description
--- | ---
[RSASSA-PSS (PS256)](https://tools.ietf.org/html/rfc3447#section-8.1) | For signing (2048 bit key)

{{% notice warning %}}
All encryption and signing in the phone app is done through `msrcrypto` which implements a shim of `SubtleCrypto` in pure JavaScript. Since this implementation is extremely slow, it will have to be replaced by a native implementation of the JOSE standard wrapped as a `react-native` package. The current candidate for iOS implementation [JOSESwift](https://github.com/airsidemobile/JOSESwift) does not support `RSA PSS` - only `RSA PKCS#1`. If this functionality cannot be added to `JOSESwift` – signing will have to be done through `RS256` instead of `PS256`
{{% /notice %}}

### The signee

#### Exposing public signing key(s)

The [Signee Service](#the-signee) publishes the required public key(s) for other parties to use when verifying the authenticity of the signee's signature. The public key(s) are published on the [Signee service's](#the-signee) domain at endpoint `/jwks`(although can be customized). 

The public key(s) are represented as [JWKS](https://tools.ietf.org/html/rfc7517) format.

### The verifier

The recipient of an incoming Egendata [Message](/data/#egendata-message-schema-definitions), performs a query to the supposed [Signee Service's](#the-signee) `/jwks` endpoint in order to obtain the public key(s) required for verification of the signature and thereby ensuring that the suggested service is in fact the issuer and signee of the received [JWE](https://tools.ietf.org/html/rfc7516) payload.

Through secure TLS connection the verifier can with high confidence trust that it is in contact with the correct signee service.

## Transactions

All messages exchanged between [Services](/services), [Operator](/operator) & Applications are signed with the sender party's own signing key and transmitted as [JWT](https://tools.ietf.org/html/rfc7519) to the receiving party.

### Panva JOSE framework

The Egendata solution utilizes the [Panva JOSE framework (GitHub)](https://github.com/panva/jose) in order to be compliant with the following RFCs:

RFC | Description
--- | ---
[JWK](https://tools.ietf.org/html/rfc7517) | JSON Web Key RFC7517, format for encryption keys.
[JWE](https://tools.ietf.org/html/rfc7516) | JSON Web Encryption RFC7516, format för encrypted data. In Egendata solution only the "General JWE JSON Serialization Syntax" is used due to that being the only one supporting multiple recipients. The content is encrypted with "A128CBC-HS256"(link?) and the recipient keys with "RSA-OAP".
[JWS](https://tools.ietf.org/html/rfc7515) | JSON Web Signature RFC7515, format for signed data. All data is signed before being encrypted. This allows the validation of the data source.
[JWT](https://tools.ietf.org/html/rfc7519) | JSON Web Token RFC7519, format for transmission of claims between all parts of the Egendata solution.

## Future considerations

There are possibilities to use the `ASE-256-CBC` for symmetric encryption.
There are no current plans to migrate to `ECDSA` for signing.

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
