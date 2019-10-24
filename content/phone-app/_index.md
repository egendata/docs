---
title: Mobile App
---


## Builds and deployments

### Context
While developing on this application. Our intention has been to regularly redistribute it to testers through Google play store and Apple Testflight. As a means to achieve this, we have started implementing a continuous deployment pipeline where we have integrated Fastlane into our Travis CI setup.

### Shared Prerequisites
_- Or what we have now that someone who wants to adopt this process needs to set up._

- Travis CI
- Fastlane

### How it's set up:

### **iOS**

*We use [Fastlane match](https://docs.fastlane.tools/actions/match/) for distributing the iOS app to Testflight. Match is a command within Fastlane that lets you (a team) use a single signing certificate and provisioning profile for building and distributing your application, rather than having several personal certificates. Using match with a private repository for storing certificates as a single source of truth is arguably a lot easier than having several certificates for different users.*

**iOS specific prerequisites:**
- Apple developer team account
- Private github repository for storing iOS provisioning profile and signing certificates

Not needed but nice to have:
- Separate apple account with limited privilege that acts as a CI user for iOS distribution

Initiating a Matchfile: 

`project-root/ios`

```bash
fastlane match init
```

This command will generate a `Matchfile` in the `ios/fastlane` directory with the following content:

```
git_url(...)
app_identifier(...)
username(...)
```

`git_url` is the private repository where the provisioning profile and certificates will be stored.

> This will be empty first and when you run `match` later it will notice that it's empty and prompt you about consent for generating new profiles and certificates to put there. More on this later.

`app_identifier` is the app name in xcode land. In our case, `com.egendata.ios`

`username` is the apple user who will perform the match operations.

> Needs to be a part of the apple developer team.

Furthermore, we extend the Matchfile with the following:

`storage_mode("git")`

> This just specifies what kind of storage you want to use for your certificates and profile.

`type("appstore")`

> Fastlane match has different types. Don't really know what the difference is, but this needs to be synced with the type of provisioning profile and signing certificate you will generate later when you run `fastlane match appstore`. `appstore` is the type we went with.

Initiating the private Github repository you have write access to:

```bash
fastlane match appstore
```
> We used the ssh url (git@...) the first time for creating the certificates etc. The one you see in the current match file is for bypassing ssh setup on CI. Now, instead, we use a github personal access token with repo privileges for authenticating. You can see how we use it in the top of the Matchfile.

This will run match with parts of the configuration that is specified in your `Matchfile`. Since the repository will be empty at this stage, match will prompt for your consent to generate a new certificate and provisioning profile and put it there.

It will also ask you to provide a password that can decrypt the repository data on subsequent operations. **This password is set as MATCH_PASSWORD environment variable in our CI pipeline (travis).**

Using match for deployments:

For this setup, we used a separate apple user that we setup and added to the apple dev team.

**The user email is declared as the environment variable FASTLANE_USER in our CI**

**The user password is declared as the environment variable FASTLANE_PASSWORD in our CI**

Fastlane looks for these variables automatically and uses them if specified.

Now we take a look in the `ios/Fastfile`, and the lane `ios_testflight`: 

`setup_travis` Don't know exactly what this does but it's needed.

`match(type: "appstore", ...)` Runs match to get the provisioning profile and certificate. It looks for the "appstore" profiles and certificates in the repo.

`build_app(...)` This builds the app using the signing pulled by `match` and builds the app. Also exports it with "app-store" configuration, this needs to match certificates too.

`pilot()` Handles upload to testflight.


### **Android**

**Android specific prerequisites:**

*We use [travis file encryption](https://docs.travis-ci.com/user/encrypting-files/) for handling all the relevant secrets for the android build and deploy step. In the `.travis.yml`s android `before_install` step, we decrypt those files that are available in the build context as secrets and we decrypt them and put them in the right directories. The files are the **google_play.json**, **release.keystore**, and the **gradle.properties**.*

- Google dev console development team.
- Secret JSON file with android specific signing details. Get from Google dev console.
- `gradle.properties` file with app specific signing variables.
- `release.keystore` file that also handles signing in some way.

Going through the `android/fastlane/Fastfile`:

`gradle(...)` Builds the app with gradle and tells it to make a `bundleRelease`, which generates a .aab bundle that is x64 and x86 compatible.

`upload_to_play_store(track: 'internal')` Does what it says and puts in in the "internal" track on Google developer console. From there you manually do whatever you wish, like moving  it to beta, or google play store.