Congratulations on installing the geohash extension!

#### Function information

* **Firestore Trigger** - ${function:locationUpdate.name} was installed and is invoked when both an x field (${param:XFIELD}) and y field (${param:YFIELD}) contain a value.

* **Callable Trigger** - ${function:callableHash.name} was installed and can be invoked by writing the following client code:
```javascript
import { getFunctions, httpsCallable } from "firebase/functions";
const functions = getFunctions();
const geoHash = httpsCallable(functions, '${function:callableHash.name}');
geoHash({ ${param:XFIELD}: -122.0840, ${param:YFIELD}: 37.4221 })
  .then((result) => {
    // Read result of the Cloud Function.
    /** @type {any} */
    const data = result.data;
    const error = data.error;
    if (error != null) {
        console.error(`callable error : ${error}`);
    }
    const result = data.result;
    console.log(result);
  });
```

#### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions_community#monitor) of your installed extension, including checks on its health, usage, and logs.