---
title: Cryptography
---

# Kryptering och signering

En grundläggande regel inom kryptering är: Never roll your own. Kryptering är svårt och det är lätt att begå misstag. Av det skälet har vi valt att använda oss av verifierade algoritmer och öppna standarder.

## Algoritmer

Det finns en rad olika krypteringsalgoritmer. Några av dessa ingår i den nya standarden för browsers – SubtleCrypto-gränssnittet mot Web Crypto API. Av dessa använder sig Egendata av:

* **AES-128-CBC** för symmetrisk kryptering

* **RSAES-OAEP med 2048 bitars nyckel** för asymmetrisk kryptering

* **RSASSA-PSS (PS256) med 2048 bitars nyckel** för signering

Vi ser för närvarande över möjligheten att ändra till `AES-256-CBC` för symmetrisk kryptering. Det finns för närvarande inga planer på att byta till `ECDSA` för signering.

## JavaScript Object Signing and Encryption - JOSE

Som format för överföring och lagring av signerad och krypterad information används ramverket JOSE vilket i sin tur består av ett antal RFC:er:

* **JWK - JSON Web Key** [RFC7517](https://tools.ietf.org/html/rfc7517) Format för krypteringsnycklar.

* **JWE - JSON Web Encryption** [RFC7516](https://tools.ietf.org/html/rfc7516) Format för krypterad data. I Egendata används enbart `General JWE JSON Serialization Syntax` då endast denna stöder flera mottagare. Innehållet krypteras med `A128CBC-HS256` och mottagarnas nycklar med `RSA-OAP`

* **JWS - JSON Web Signature** [RFC7515](https://tools.ietf.org/html/rfc7515) Format för signerad information. All data signeras innan den krypteras. Detta möjliggör validering av att datan kommer från den Tjänst som påstås.

* **JWT - JSON Web Token** [RFC7519](https://tools.ietf.org/html/rfc7519) Format för överföring av `claims` mellan plattformens olika delar. Alla anrop mellan Tjänst, Operator och Egendata-appen skickas i form av JWT:er signerade med partens huvudsigneringsnyckel. Eventuellt kommer rotation av nycklar införas för detta. Varje meddelande valideras av mottagande part genom att nyckeln hämtas från sändande tjänst i ett separat anrop. Undantaget är Egendata-appen som inte kan agera server utan därför bilägger nyckeln i anropet.
