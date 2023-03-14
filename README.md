# Latitude and Longitude to GeoHash converter

**Author**: Sparky (**[https://github.com/Firebase](https://github.com/Firebase)**)

**Description**: A converter for changing your Latitude and Longitude coordinates to geohashes.



**Details**: Use this extension to automatically convert documents with a latitude and longitude to a geohash in your database. Additionally, this extension also includes a callable function that will allow users to make one time calls to convert an x,y coordinate to a geohash.

Geohashing supported for latitudes between 90 and -90 and longitudes supported for 180 to -180.

#### Third Party API Key

This extension uses a fictitious third party API for calculating the geohash. You will need to supply your own API keys. (Since its fictitious, you can use 1234567890 as an API key).

#### Additional setup

Before installing this extension, make sure that you've [set up a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) in your Firebase project.

After installing this extension, you'll need to:

- Update your client code to point to the callable geohash function if you want to perform arbitrary geohashes.

Detailed information for these post-installation tasks are provided after you install this extension.

#### Billing
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
 - Cloud Firestore
 - Cloud Functions (Node.js 16+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))
 - [Cloud Secret Manager](https://cloud.google.com/secret-manager/pricing)



**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database. Realtime Database instances are located in `us-central1`. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* The X Field Name: The X Field is also known as the **longitude** value. What does your firestore instance refer to as the X value or the longitude value. If no value is specified, the extension will search for field 'x'.

* The Y Field Name: The Y Field is also known as the **latitude** value. What does your firestore instance refer to as the Y value or the latitude value. If no value is specified, the extension will search for field 'y'.

* The input document to listen to for changes: This is the document where you will write an x and y value to. Once that document has received a value, it will notify the extension to calculate a geohash and store that in an output document in a certain field. This accepts function [wildcard parameters](https://firebase.google.com/docs/functions/firestore-events#wildcards-parameters)

* The output document where changes will be written: The output document is the document where we will store the geohash that we just calculated. Its preferred to have this document be different than the input document.

* Geohash field: This specifies the field in the output document to store the geohash in.

* GeohashService API Key: Your geohash service API Key. Since this is a demo, and not a real service, you can use : 1234567890.



**Cloud Functions:**

* **locationUpdate:** undefined

* **callableHash:** undefined



**APIs Used**:

* secretmanager.googleapis.com (Reason: The service used to store our sensitive API key)



**Access Required**:



This extension will operate with the following project IAM roles:

* datastore.user (Reason: Allows the extension to read / write to your Firestore instance.)
