import {firestore} from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {GeoHashService, ResultStatusCode} from "./fake-geohash-service";
import {onCall} from "firebase-functions/v1/https";
import {fieldValueExists, insertParamsIntoPath, shouldCompute} from "./utils";
import {getFirestore} from "firebase-admin/firestore";
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const documentPath = "users/{uid}";
const xField = "x";
const yField = "y";
const apiKey = "1234567890";
const outputPath = "users/{uid}";
const outputField = "hash";

initializeApp();

const service = new GeoHashService(apiKey);

export const locationUpdate = firestore.document(documentPath)
  .onWrite((change, context) => {
    // checks if data was deleted or if it was a recursive call triggering
    // this function to run
    if (!shouldCompute(change, xField) && !shouldCompute(change, yField)) {
      return 0;
    }

    // double check that both values exist for computation
    if (
      !fieldValueExists(change.after.data(), xField) ||
      !fieldValueExists(change.after.data(), yField)
    ) {
      return 0;
    }

    const x: number = change.after.data()![xField];
    const y: number = change.after.data()![yField];

    const hash = service.convertToHash(x, y);

    const formattedOutputPath = insertParamsIntoPath(context, outputPath);

    return getFirestore()
      .doc(formattedOutputPath)
      .update(
        {
          [outputField]: hash.hash,
        }
      );
  });

export const callableHash = onCall((data, context) => {
  if (context.auth == undefined) {
    return {error: `Only authorized users are allowed to call this endpoint`}
  }
  const x = data[xField];
  const y = data[yField];
  if (x == undefined || y == undefined) {
    return {error: "Either x or y parameter was not declared"};
  }
  const result = service.convertToHash(x, y);
  if (result.status != ResultStatusCode.ok) {
    return {error: `Something went wrong ${result.message}`};
  }
  return {result: result.hash};
});
