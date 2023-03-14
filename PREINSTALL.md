Use this extension to automatically convert documents with a latitude and longitude to a geohash in your database. Additionally, this extension also includes a callable function that will allow users to make one time calls to convert an x,y coordinate to a geohash.

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