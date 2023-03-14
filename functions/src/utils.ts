import {logger} from "firebase-functions/v1";
/**
 * A function to determine whether field values exist on the object
 * @param {FirebaseFirestore.DocumentData} afterObject
 * @param {string} field
 * @return {boolean}
 */
export function fieldValueExists(
  afterObject: FirebaseFirestore.DocumentData | undefined,
  field: string): boolean {
  if (afterObject == undefined) {
    return false;
  }
  const aValue = afterObject[field];
  if (aValue == undefined) {
    logger.log(`missing value ${aValue} for field ${field}, cannot compute`);
    return false;
  }
  return true;
}