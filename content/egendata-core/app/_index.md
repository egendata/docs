---
title: App
---

The App is the end user's interface to the Egendata world.

This is where the user creates and manages their own Egendata account.

Upon account creation the Egendata App generates your own personal key pair(private and public key).
This key pair is stored locally on the device and is used for all interactions with the Operator and other Egendata enabled services.

Your private key only stored locally on the device and never transmitted to any other party.
A lost private key is the same as loosing access to your own Egendata account.

By design, Egendata can not recover access to a user's lost account (lost private key).
Therefore, it's the user's own responsibility to keep their own private key safe.

## Concerns:

- The user is not sufficiently informed about the importance of safe-keeping their private key and the impacts of a lost key.
- There are no built-in features allowing the user to mirror or backup their private key.
- The Egendata App deep-link implementation suffer risks hi-jacking, implementation of proper deep-link verification mitigates this issue.
- Utilize a hashing algorithm(Argon2i?) for maximizing the resistancy against GPU cracking attacks if sensitive details(such as private keys or password) must be locally stored on the device.
- The App should require human input(pin, password, fingerprint, facescan, or similar) to complete the private key required to act as the user account.
