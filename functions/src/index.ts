/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {firestore} from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {GeoHashService, ResultStatusCode} from "./fake-geohash-service";
import {onCall} from "firebase-functions/v1/https";
import {fieldValueExists} from "./utils";

const documentPath = process.env.INPUTPATH!; // "users/{uid}";
const xField = process.env.XFIELD!; // "xv";
const yField = process.env.YFIELD!; // "yv";
const apiKey = process.env.APIKEY!; // "1234567890";
const outputField = process.env.OUTPUTFIELD!; // "hash";

initializeApp();

const service = new GeoHashService(apiKey);

export const locationUpdate = firestore.document(documentPath)
  .onWrite((change) => {
    // item deleted
    if (change.after == null) {
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

    // This is to check whether the hash value has changed. If
    // it hasn't we don't want to write to the DB again as it
    // would create a recursive write loop
    if(fieldValueExists(change.after.data(), outputField)
      && change.after.data()![outputField] == hash) {
      return 0;
    }

    return change.after.ref
      .update(
        {
          [outputField]: hash.hash,
        }
      );
  });

export const callableHash = onCall((data, context) => {
  if (context.auth == undefined) {
    return {error: "Only authorized users are allowed to call this endpoint"};
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
