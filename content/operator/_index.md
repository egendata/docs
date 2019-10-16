---
title: Operator
---

Placeholder

## Writing to PDS

1. The Operator receives the incoming message(JWT) and validates the integrity of the message(JWT signature verification).
1. After that, the Operator performs queries to its own database based upon the JWT properties "sub", "iss", "domain" and "area" of each "content path" entry. (See the Egendata messaging schemas...)
1. If valid write permissions are found by the queries, the query result contains details about the "pdsProvider" and "pdsCredentials".
1. The destination PDS directory path is defined based upon "connectionId", "domain" and "area".
`/data/${encodeURIComponent(connectionId)}/${encodeURIComponent(domain)}/${encodeURIComponent(area)}/data.json`
1. The JWE(encrypted at the service) of the received JWT, is extracted and written to the users PDS and a successful status code 201 is returned to the service, alternatively 403 upon error.

## Reading from PDS

1. The Operator receives the incoming message(JWT) and performs a lookup in its database to verify that the requesting Service has sufficient read permissions for a user’s PDS.
1. If valid sufficient read permissions are found, the database query result contains details about the "pdsProvider" and "pdsCredentials".
1. The Operator constructs the "content path" strings that locate the data within the user's PDS. `/data/${encodeURIComponent(connectionId)}/${encodeURIComponent(domain)}/${encodeURIComponent(area)}/data.json`
1. The data(JWE) is read from the user's PDS, packed into a new JWT message of type "DATA_READ_RESPONSE" and finally transmitted back to the requesting Service.
