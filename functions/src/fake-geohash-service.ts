import {geohashForLocation} from "geofire-common";

export enum ResultStatusCode {
    ok = "OK",
    error = "ERROR",
    invalidApiKey = "INVALIDAPIKEY",
}

interface Result {
    status: ResultStatusCode,
    hash?: string,
    message?: string,
}

/** A fake service to demo communicating with a service in an extension. */
export class GeoHashService {
/**
 * Create an instance of the geohash service from an API Key
 * @param {string} apiKey
 */
  constructor(apiKey: string) {
    this._apiKey = apiKey;
  }

  private _apiKey = "";

  /**
 * Validates that the API key supplied is valid
 * Only valid API key is "1234567890"
 * @return {boolean}
 */
  private validAPIKey(): boolean {
    if (this._apiKey != "1234567890") {
      return false;
    }
    return true;
  }

  /**
 * Converts the supplied x, y to a geohash. The values must be within a
 * valid lat / lng range
 * @param {number} x
 * @param {number} y
 * @return {Result}
 */
  convertToHash(x: number, y: number): Result {
    if (!this.validAPIKey()) {
      return {
        status: ResultStatusCode.invalidApiKey,
        message: "Invalid API key supplied",
      };
    }
    if (x > 180 || x < -180) {
      return {
        status: ResultStatusCode.error,
        message: "X out of range (-180 -> 180)",
      };
    }
    if (y > 90 || y < -90) {
      return {
        status: ResultStatusCode.error,
        message: "Y out of range (-90 -> 90)",
      };
    }
    const hash = geohashForLocation([y, x]);
    return {
      status: ResultStatusCode.ok,
      hash: hash,
    };
  }
}
