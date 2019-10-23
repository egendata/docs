---
title: Messages
---

All communication between the different Egendata parties is performed through signed messages shaped as JWT:s.

## Egendata message/schema definitions

All message schemas are defined in and validated through [./lib/schemas.js](https://github.com/egendata/messaging/blob/master/lib/schemas.js) in the `@egendata/messaging` npm package.

### Values present in all messages

_Some values are present in all messages. These are defined as reserved claims in the JWT spec and reused as `JWT_DEFAULTS`_

Property | Purpose
--- | ---
iss | The issuer of the message. Example: `https://myservice.org`
aud | The intended audience of the message. Example: `https://operator.egendata.se`
iat | Unix timestamp for when the message was created.
exp | Unix timestamp for when the message expires.

### Messages currently in use

#### SERVICE_REGISTRATION

From | To
--- | ---
Service | Operator

_Message sent when the service registers itself._

Property | Purpose
--- | ---
type | SERVICE_REGISTRATION
JWT_DEFAULTS.iss | The service's host URL
JWT_DEFAULTS.aud | The URL of the Operator
displayName | The name the service wants to display to users.
description | The description the service wants to display to the users.
iconURI | Relative or actual URI of the icon the service wants to display to the users.
jwksURI | The main URI linked to the service. It will also be used as the service’s id in the database.
eventsURI | The URI the service will be receiving event responses.

---

#### ACCOUNT_REGISTRATION

From | To
--- | ---
User device | Operator

_Message sent when the user is registering an account._

Property | Purpose
--- | ---
type | ACCOUNT_REGISTRATION
JWT_DEFAULTS.iss | egendata://account/[account_id]
JWT_DEFAULTS.aud | The URL of the Operator
pds | Information about the PDS the user has selected for their account.
 pds.provider | The type of PDS used. As of now the options are Dropbox and in memory. In memory means the operators internal memory.
 pds. access_token | In the case the PDS requires authentication, this is the token to be used for it. As of now this applies to the Dropbox option.

---

#### AUTHENTICATION_REQUEST

From | To
--- | ---
Service | User device

_Message sent for authentication between the sender and receiver._

Property | Purpose
--- | ---
type | AUTHENTICATION_REQUEST
JWT_DEFAULTS.iss | The service's host URL
JWT_DEFAULTS.aud | egendata://account
sid | The (browser) session id that this message was sent during.
eventsURI | The URI that the service expects the responses to the messages to be received.

---

#### CONNECTION_INIT

From | To
--- | ---
User device | Service

_Initiates a connection between the user and the service. Is triggered when there is no pre-existing connection between these two parties._

Property | Purpose
--- | ---
type | CONNECTION_INIT
JWT_DEFAULTS.iss | egendata://account
JWT_DEFAULTS.aud | The service's host URL
sid | The (browser) session id that this message was sent during.

---

#### CONNECTION_REQUEST
 
From | To
--- | ---
Service | User device

_Response to a `CONNECTION_INIT` message._

Property | Purpose
--- | ---
type | CONNECTION_REQUEST
JWT_DEFAULTS.aud |  <INFO>      
JWT_DEFAULTS.exp |  <INFO>      
JWT_DEFAULTS.iat |  <INFO>      
JWT_DEFAULTS.iss | <INFO>   
permissions | A `PERMISSION_REQUEST_ARRAY` list of at least one with permissions for the user to accept or deny.
sid | The (browser) session id that this message was sent during.
displayName | The display name of the service.
description | The description of the service.
iconURI | The icon of the service.

---

#### CONNECTION

From | To
--- | ---
User device | Operator -> Service

_Message sent from the user's device the operator who then forwards it to the service, containing information about the connection between the two endpoints._

Property | Purpose
--- | ---
type | CONNECTION
JWT_DEFAULTS.aud |  <INFO>      
JWT_DEFAULTS.exp |  <INFO>      
JWT_DEFAULTS.iat |  <INFO>      
JWT_DEFAULTS.iss | <INFO>   
sid | The (browser) session id that this message was sent during.
sub | <INFO>
permissions | Information about the permissions the user has accepted and denied.
 permissions.approved | The list of approved permissions.
 permissions.denied | The list of denied permissions.

---

#### CONNECTION_RESPONSE

From | To
--- | ---
User device | Operator

_The message sent by the device to the operator containing the `CONNECTION` message._

Property | Purpose
--- | ---
type | CONNECTION_RESPONSE
JWT_DEFAULTS.aud |  <INFO>      
JWT_DEFAULTS.exp |  <INFO>      
JWT_DEFAULTS.iat |  <INFO>      
JWT_DEFAULTS.iss | <INFO> 
payload | The `CONNECTION`message sent as a serialized JWS type.

---

#### CONNECTION_EVENT

From | To
--- | ---
Operator | Service

_The message sent by the operator to the service containing the `CONNECTION` message._

Property | Purpose
--- | ---
type | CONNECTION_EVENT
JWT_DEFAULTS.aud |  <INFO>      
JWT_DEFAULTS.exp |  <INFO>      
JWT_DEFAULTS.iat |  <INFO>      
JWT_DEFAULTS.iss | <INFO> 
payload | The `CONNECTION`message sent as a serialized JWS type.

---

#### LOGIN

From | To
--- | ---
User device | Operator

_Message sent from the user's device the operator who then forwards it to the service, so the user can login to the service._

Property | Purpose
--- | ---
type | LOGIN
JWT_DEFAULTS.aud |  <INFO>      
JWT_DEFAULTS.exp |  <INFO>      
JWT_DEFAULTS.iat |  <INFO>      
JWT_DEFAULTS.iss | <INFO> 
sid | The (browser) session id that this message was sent during.
sub | <INFO>

---

#### LOGIN_RESPONSE

From | To
--- | ---
User device | Operator

_The message sent by the device to the operator containing the `LOGIN` message._

Property | Purpose
--- | ---
type | LOGIN_RESPONSE
JWT_DEFAULTS.aud |  <INFO>      
JWT_DEFAULTS.exp |  <INFO>      
JWT_DEFAULTS.iat |  <INFO>      
JWT_DEFAULTS.iss | <INFO> 
payload | The `LOGIN` message sent as a serialized JWS type.

---

#### LOGIN_EVENT

From | To
--- | ---
Operator | Service

_The message sent by the operator to the service containing the `LOGIN` message._

Property | Purpose
--- | ---
type | LOGIN_EVENT
JWT_DEFAULTS.aud |  <INFO>      
JWT_DEFAULTS.exp |  <INFO>      
JWT_DEFAULTS.iat |  <INFO>      
JWT_DEFAULTS.iss | <INFO> 
payload | The `LOGIN` message sent as a serialized JWS type.

---

#### ACCESS_TOKEN

From | To
--- | ---
<INFO> | <INFO>

_PURPOSE-GOES-HERE_

Property | Purpose
--- | ---
type | ACCESS_TOKEN
JWT_DEFAULTS.aud |  <INFO>      
JWT_DEFAULTS.exp |  <INFO>      
JWT_DEFAULTS.iat |  <INFO>      
JWT_DEFAULTS.iss | <INFO> 
sub | <INFO>

---

### Fields & values


#### LAWFUL_BASIS

_Defines the lawful basis of the information permission request as defined in GDPR. Currently all requests default to `CONSENT` and no architectural concessions have been made to handle other cases. Therefore all other values are disallowed in validation._

---

#### CONTENT_PATH

_Instead of obtaining permission to store all sorts of data about the user, Egendata requires explicit permission per information area. These permissions might eventually be obtained with different lawful bases. Examples are `base_info`, `education`, `work-experience` and so on. Technically these areas will translate into paths on the PDS._

Property | Purpose
--- | ---
domain | The URL of the data generating service
area | The name of the information given by the issuing service

---

#### READ_PERMISSION_REQUEST

_Message sent to request a read permission._

Property | Purpose
--- | ---
...PERMISSION_BASE | Adds basic information about the permission requested.
type | READ
purpose | The purpose of the permission being requested.
jwk | The key of the service that will be used when they decrypt the data for read purposes.

---

#### WRITE_PERMISSION_REQUEST

_Message sent to request a write permissions. This can contain more than one `WRITE_PERMISSION`._

Property | Purpose
--- | ---
...PERMISSION_BASE |  _Adds basic information about the permission requested._
type | WRITE
description | The description of the information that will be written. 

---

#### PERMISSION_REQUEST_ARRAY

_The list of permission requests sent to the user for approval._

Property | Purpose
--- | ---
READ_PERMISSION_REQUEST | The read permissions requested.
WRITE_PERMISSION_REQUEST | The write permissions requested.

---

#### READ_PERMISSION

_The information for each individual read permission requested._

Property | Purpose
--- | ---
...PERMISSION_BASE |  _Adds basic information about the permission requested._
type | READ
purpose | The reason the permission is requested.
kid | PURPOSE-GOES-HERE

---

#### WRITE_PERMISSION

_The information for each individual write permission requested._

Property | Purpose
--- | ---
...PERMISSION_BASE |  _Adds basic information about the permission requested._
type | WRITE
description | The description of the information that will be written.
jwks | Link to the key store where the keys required to encrypt the data is stored.

---

#### PERMISSION_ARRAY

_List of the permissions accepted by the user for this service._ 

Property | Purpose
--- | ---
READ_PERMISSION | The read permissions requested.
WRITE_PERMISSION | The write permissions requested.

---

#### PERMISSION_DENIED

_A permission that has been denied by the user for this service._ 

Property | Purpose
--- | ---
...PERMISSION_BASE | Adds basic information about the permission requested.

---

#### DATA_READ_REQUEST

_Message sent by the service to the operator to request data for read purposes. This can contain more than one requests._

Property | Purpose
--- | ---
type | DATA_READ_REQUEST
JWT_DEFAULTS.aud |  <INFO>      
JWT_DEFAULTS.exp |  <INFO>      
JWT_DEFAULTS.iat |  <INFO>      
JWT_DEFAULTS.iss | <INFO>
sub | <INFO>
paths | The paths to the data the service is requesting to read,
 paths.domain | The domain of the data the service requests to read. By default it is its own domain but could also be a different service's domain._
 paths.area | The section of data the service requests to read, for example education, languages soon._

---

#### DATA_READ_RESPONSE

_Response to a `DATA_READ_REQUEST` sent to the service by the operator. Each read request is handled and responded to individually._

Property | Purpose
--- | ---
type | DATA_READ_RESPONSE
JWT_DEFAULTS.aud |  <INFO>      
JWT_DEFAULTS.exp |  <INFO>      
JWT_DEFAULTS.iat |  <INFO>      
JWT_DEFAULTS.iss | <INFO> 
sub | <INFO>
paths | The paths to the data the service is requesting to read,
 paths....CONTENT_PATH | <INFO>
 paths.data | The data sent back to the service for this particular request.
 paths.error | Error messages that might occur, for example missing data or denied permissions.
  paths.error.message | The message of the error message.
  paths.error.status | The status of the error message.
  paths.error.code | The code of the error message.
  paths.error.stack | <INFO>

---

#### DATA_WRITE

_Message sent containing encrypted data to be written to the users PDS. The message is sent by the service to the operator. All the different domain and area paths that will be written to are handled together by one message of this type._

Property | Purpose
--- | ---
type | DATA_WRITE
JWT_DEFAULTS.aud |  <INFO>      
JWT_DEFAULTS.exp |  <INFO>      
JWT_DEFAULTS.iat |  <INFO>      
JWT_DEFAULTS.iss | <INFO> 
sub | <INFO>
paths | List of at least one, of domain and area paths that the data will be written to.
 paths....CONTENT_PATH | <INFO>
 paths.data | The data to be written in this path.

### Not yet implemented

#### PERMISSION_REQUEST

_Message sent by the service to the operator in order to request permissions._

Property | Purpose
--- | ---
type | PERMISSION_REQUEST
JWT_DEFAULTS.aud |  <INFO>      
JWT_DEFAULTS.exp |  <INFO>      
JWT_DEFAULTS.iat |  <INFO>      
JWT_DEFAULTS.iss | <INFO> 
permissions | A `PERMISSION_ARRAY`containing at least one permission.
sub | <INFO>
sid | The (browser) session id that this message was sent during.
