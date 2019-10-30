---
title: Messages
---

All communication between the different Egendata parties is performed through signed messages shaped as JWT:s.

## Egendata message/schema definitions

All message schemas are defined in and validated through [./lib/schemas.js](https://github.com/egendata/messaging/blob/master/lib/schemas.js) in the `@egendata/messaging` npm package.

### Values present in all messages

_Some values are present in all messages, their value will only be specified where it deviates from the default. These are defined as reserved claims in the JWT spec._

#### JWT_DEFAULTS

Property | Purpose
--- | ---
iss | The issuer of the message. Example: `https://myservice.org`
aud | The intended audience of the message. Example: `https://operator.egendata.se`
iat | Unix timestamp for when the message was created.
exp | Unix timestamp for when the message expires.

### Messages

#### SERVICE_REGISTRATION

From | To
--- | ---
Service | Operator

_Message sent when the service registers itself._

Property | Purpose
--- | ---
type | SERVICE_REGISTRATION
[JWT_DEFAULTS](#jwt-defaults).iss | The service's host URL
[JWT_DEFAULTS](#jwt-defaults).aud | The URL of the Operator
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
[JWT_DEFAULTS](#jwt-defaults).iss | egendata://account/[account_id]
[JWT_DEFAULTS](#jwt-defaults).aud | The URL of the Operator
pds | Information about the PDS the user has selected for their account.
 pds.provider | The type of PDS used. As of now the options are Dropbox and in memory. In memory means the operators internal memory.
 pds.access_token *optional* | In the case the PDS requires authentication, this is the token to be used for it. As of now this applies to the Dropbox option.

---

#### AUTHENTICATION_REQUEST

From | To
--- | ---
Service | User device

_Message transmitted from a service to a user prompting the user to authenticate. In the current implementation this is done by putting this information in a QR-code that the user scans._

Property | Purpose
--- | ---
type | AUTHENTICATION_REQUEST
[JWT_DEFAULTS](#jwt-defaults).iss | The service's host URL
[JWT_DEFAULTS](#jwt-defaults).aud | egendata://account
sid | The (browser) session id associated with the request
eventsURI | URI where the service listens to responses to this message

---

#### CONNECTION_INIT

From | To
--- | ---
User device | Service

*Initiates a connection between the user and the service. Is generally triggered from an [`AUTHENTICATION_REQUEST`](#authentication-request) when there is no pre-existing connection between these two parties.*

Property | Purpose
--- | ---
type | CONNECTION_INIT
[JWT_DEFAULTS](#jwt-defaults).iss | egendata://account
[JWT_DEFAULTS](#jwt-defaults).aud | The service's host URL
sid | The (browser) session id that should be logged in after establishment

---

#### CONNECTION_REQUEST
 
From | To
--- | ---
Service | User device

*Response to a [`CONNECTION_INIT`](#connection-init) message.*

Property | Purpose
--- | ---
type | CONNECTION_REQUEST
[JWT_DEFAULTS](#jwt-defaults).aud | egendata://account
[JWT_DEFAULTS](#jwt-defaults).iss | The service's host URL
permissions *optional* | A [`PERMISSION_REQUEST_ARRAY`](#permission-request-array) list of at least one permission that the service wants from the user
sid | The (browser) session id that should be logged in after establishment
displayName | The display name of the service.
description | The description of the service.
iconURI | The icon of the service.

---

#### CONNECTION_RESPONSE

From | To
--- | ---
User device | Operator

_Sent by the user's device in response to a [`CONNECTION_REQUEST`](#connection-request). Contains the [`CONNECTION`](#connection) the user wants establish with the service._

Property | Purpose
--- | ---
type | CONNECTION_RESPONSE
[JWT_DEFAULTS](#jwt-defaults).aud | URL of the operator
[JWT_DEFAULTS](#jwt-defaults).iss | egendata://account/[account_id] 
payload | The [`CONNECTION`](#connection) as a serialized JWS.

---

#### CONNECTION_EVENT

From | To
--- | ---
Operator | Service

_Sent by the operator to inform the service about a newly established [`CONNECTION`](#connection)_

Property | Purpose
--- | ---
type | CONNECTION_EVENT
[JWT_DEFAULTS](#jwt-defaults).aud | URL of the service
[JWT_DEFAULTS](#jwt-defaults).iss | URL of the operator
payload | The [`CONNECTION`](#connection) as a serialized JWS.

---

#### LOGIN_EVENT

From | To
--- | ---
Operator | Service

_Sent by the operator to the service containing the [`LOGIN`](#login)._

Property | Purpose
--- | ---
type | LOGIN_EVENT
[JWT_DEFAULTS](#jwt-defaults).aud | URL of the service
[JWT_DEFAULTS](#jwt-defaults).iss | URL of the operator
payload | The [`LOGIN`](#login) as a serialized JWS.

---

#### ACCESS_TOKEN

From | To
--- | ---
Service backend | Service frontend

_JWT used to access a resource. Currently used by the service frontend (ie. the user's browser) to store its login session with the service backend; but could in the future be used to control other types of access as well._

Property | Purpose
--- | ---
type | ACCESS_TOKEN
[JWT_DEFAULTS](#jwt-defaults).aud | URL of the service
[JWT_DEFAULTS](#jwt-defaults).iss | URL of the service 
sub | V4 uuid of the [CONNECTION](#connection) which is logged in

---

### Fields & values

#### CONNECTION

From | To
--- | ---
User device | Operator -> Service

_Message containing information about an established connection between a user and a service. Sent from the user's device to the operator wrapped in a [CONNECTION_RESPONSE](#connection-response). The operator then forwards it to the service in a [CONNECTION_EVENT](#connection-event)._

Property | Purpose
--- | ---
type | CONNECTION
[JWT_DEFAULTS](#jwt-defaults).aud | URL of the service
[JWT_DEFAULTS](#jwt-defaults).iss | egendata://account
sid | The (browser) session id that should be logged in after establishment
sub | A v4 uuid that uniquely identifies this connection
permissions *optional* | Information about any permissions the user has accepted or denied
 permissions.approved *optional* | List of approved permissions
 permissions.denied *optional* | List of denied permissions

---

#### LOGIN

From | To
--- | ---
User device | Operator -> Service

_Sent from the user's device to the operator in a [`LOGIN_RESPONSE`](#login-response). The operator then forwards it to the service in a [`LOGIN_EVENT`](#login-event) so that the service logs the session id in `sid` in as the user represented by the connection specified in `sub`._

Property | Purpose
--- | ---
type | LOGIN
[JWT_DEFAULTS](#jwt-defaults).aud | URL of the service
[JWT_DEFAULTS](#jwt-defaults).iss | egendata://account
sid | The (browser) session id that should be logged in
sub | V4 uuid of the [`CONNECTION`](#connection) that should be logged in. 

---

#### PERMISSION_BASE

_These properties are present in several objects related to permissions._

Property | Purpose
--- | ---
...CONTENT_PATH | 
id | A uuid identifying this permission-object.
type | The type of the permission, right now only 'READ' and 'WRITE' are supported.
lawfulBasis | The legal basis for processing information, as defined in the GDPR. Currently only 'CONSENT' is supported.

---

#### READ_PERMISSION_REQUEST

_Message sent to request permission to read and process the content._

Property | Purpose
--- | ---
[...PERMISSION_BASE](#permission-base) |
type | READ
purpose | The purpose of the permission being requested.
jwk | The key of the service that will be used when they decrypt the data for read purposes.

---

#### WRITE_PERMISSION_REQUEST

_Message sent to request a write permissions. This can contain more than one `WRITE_PERMISSION`._

Property | Purpose
--- | ---
[...PERMISSION_BASE](#permission-base) | 
type | WRITE
description | The description of the information that will be written. 

---

#### READ_PERMISSION

_A permission to read and process data. Signed by the approving party._

Property | Purpose
--- | ---
[...PERMISSION_BASE](#permission-base) | 
type | READ
purpose | The purpose of processing data.
kid | Id of the key that will be used to read the data in question.

---

#### WRITE_PERMISSION

_A permission to write data. Signed by the approving party._

Property | Purpose
--- | ---
[...PERMISSION_BASE](#permission-base) | 
type | WRITE
description | The description of the information that will be written.
jwks | Link to the key store where the keys required to encrypt the data is stored.

---

#### PERMISSION_REQUEST_ARRAY

_The list of permission requests sent to the user for approval._

Property | Purpose
--- | ---
READ_PERMISSION_REQUEST | The read permissions requested.
WRITE_PERMISSION_REQUEST | The write permissions requested.

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
[...PERMISSION_BASE](#permission-base) |

---

#### DATA_READ_REQUEST

_Message sent by the service to the operator to request data for read purposes. This can contain more than one requests._

Property | Purpose
--- | ---
type | DATA_READ_REQUEST
[JWT_DEFAULTS](#jwt-defaults).aud |  <INFO>      
[JWT_DEFAULTS](#jwt-defaults).exp |  <INFO>      
[JWT_DEFAULTS](#jwt-defaults).iat |  <INFO>      
[JWT_DEFAULTS](#jwt-defaults).iss | <INFO>
sub | <INFO>
paths[] | The paths to the data the service is requesting to read,
 paths.domain | The domain of the data the service requests to read. By default it is its own domain but could also be a different service's domain._
 paths.area | The section of data the service requests to read, for example education, languages soon._

---

#### DATA_READ_RESPONSE

_Response to a `DATA_READ_REQUEST` sent to the service by the operator. Each read request is handled and responded to individually._

Property | Purpose
--- | ---
type | DATA_READ_RESPONSE
[JWT_DEFAULTS](#jwt-defaults).aud |  <INFO>      
[JWT_DEFAULTS](#jwt-defaults).exp |  <INFO>      
[JWT_DEFAULTS](#jwt-defaults).iat |  <INFO>      
[JWT_DEFAULTS](#jwt-defaults).iss | <INFO> 
sub | <INFO>
paths[] | The paths to the data the service is requesting to read,
 domain | The URL of the service creating data
 area | The particular data point for that domain. The creator of the data chooses which points to divide the data into.
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
[JWT_DEFAULTS](#jwt-defaults).aud |  <INFO>      
[JWT_DEFAULTS](#jwt-defaults).exp |  <INFO>      
[JWT_DEFAULTS](#jwt-defaults).iat |  <INFO>      
[JWT_DEFAULTS](#jwt-defaults).iss | <INFO> 
sub | <INFO>
paths[] | List of at least one, of domain and area paths that the data will be written to.
 domain | The URL of the service creating data
 area | The particular data point for that domain. The creator of the data chooses which points to divide the data into.
 paths.data | The data to be written in this path.

### Not yet implemented

#### PERMISSION_REQUEST

_Message sent by the service to the operator in order to request permissions._

Property | Purpose
--- | ---
type | PERMISSION_REQUEST
[JWT_DEFAULTS](#jwt-defaults).aud |  <INFO>      
[JWT_DEFAULTS](#jwt-defaults).exp |  <INFO>      
[JWT_DEFAULTS](#jwt-defaults).iat |  <INFO>      
[JWT_DEFAULTS](#jwt-defaults).iss | <INFO> 
permissions | A `PERMISSION_ARRAY`containing at least one permission.
sub | <INFO>
sid | The (browser) session id that this message was sent during.
