---
title: Services
---

## Read from PDS via Operator

### Sending the read request

1. The Service constructs a JWT message ("DATA_READ_REQUEST") with desired "content paths" and a connectionId(sub).
1. The message(JWT) is transmitted to the Operator.

### Handling the read response

1. The service receives the incoming message(JWT) and iterates through all listed "content paths"
    1. The Service inspects the JWE and locates its own "Recipient" key.
    1. The Service obtains the required decryption key for the encrypted data, through decrypting its own "Recipient" entry with it's own private key.
    1. The JWE is then decrypted with the decryption key.
1. All "content paths" are returned with decrypted data, alternatively error if something went wrong in the previous step.

:warning: Ask/Check if the Service's received message contains all intended Recipients or just a single one.

## Write to PDS via Operator

### Sending the write request

1. When a service wants to write to a user’s PDS, a JWT message of type "DATA_WRITE" is constructed with the following inputs are required: "domain", "area" and optionally "data"(JWE). A "DATA_WRITE" without any data is essentially the same as clearing the data located at the “content path” of the user’s PDS.
1. First a signing key(JWK) is constructed based upon the "domain" and "area" (This is not fully implemented and instead the service's own private key(from the client configuration) is used).
1. The "data" is signed with the service's private key and represented as an JWS object.
1. A JWE is then constructed based upon the JWS and each read permissioned recipient.
1. Finally the JWE is packed into a JWT and transmitted over to the Operator.

### Handling the write response

Placeholder

---

__TODO: hur sätter man upp en tjänst. länka till repo för service__

## Flöde

När en användare vill använda en tjänst sker det genom ett antal steg. Flera av dessa är osynliga för användaren och, om Tjänsten använder använder befintliga kodbibliotek, ingenting som Tjänstens systemutvecklare ser då de sker i bakgrunden. Flödet för anslutning till en tjänst, medgivande för dataläsning/-skrivning och uppdateringar beskrivs här översiktligt och på djupet (för den som är intresserad).

### För användaren

1. Användaren går in på en Tjänst och erbjuds registrera sig/logga in med Egendata. Detta sker genom att antingen scanna en QR-kod med Egendata-appen eller, om hen använder mobilen, klicka på en länk.

2. Egendata-appen frågar användaren om hen vill logga in om registrering redan har skett, eller skapa en relation med Tjänsten om detta är första besöket. Användaren får, i det senare fallet, även möjligheten att godkänna Tjänstens begäran om att läsa/skriva data.

3. När användaren har svarat, än hen inloggad på Tjänsten och kan börja använda den.

### Så här går det till i bakgrunden

1. Tjänsten presenterar en länk, vilken också kodas som en QR-kod. Länken beskriver tjänsten med id för tjänsten och ett sessionsid för att kunna koppla svaret till rätt användarsession. All information är signerad med tjänstens signeringsnyckel.

2. Egendata-appen kontaktar tjänsten och begär signeringsnyckeln. Den verifierar sedan informationen.

3. Egendata-appen kontrollerar om användaren och tjänsten redan har en relation eller om en sådan måste skapas.

