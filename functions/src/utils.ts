import {Change, EventContext, firestore, logger} from "firebase-functions/v1";

/**
 * Determines whether or not the write status was a delete
 * @param {Change<firestore.DocumentSnapshot>} change
 * @return {boolean}
 */
export function isDelete(
  change: Change<firestore.DocumentSnapshot>): boolean {
  const afterObject = change.after.data();
  if (!change.after.exists || afterObject == undefined) {
    return true;
  }
  return false;
}

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

/**
 * Determines whether or not this change should be computed based on whether
 * the change is a create, delete or update.
 * @param {Change<firestore.DocumentSnapshot>} change
 * @param {string} field
 * @return {boolean}
 */
export function shouldCompute(
  change: Change<firestore.DocumentSnapshot>, field: string): boolean {
  if (isDelete(change)) {
    logger.log("change was a delete, should not compute");
    return false;
  }

  if (!change.before.exists) {
    logger.log("new object, should compute");
    return true;
  }

  const afterObject = change.after.data();
  const beforeObject = change.before.data();

  if (!fieldValueExists(afterObject!, field)) {
    return false;
  }

  if (beforeObject![field] == afterObject![field]) {
    logger.log("no meaningful value change, should not compute");
    return false;
  }

  logger.log("meaningful change, should compute");
  return true;
}

const regex = /\{(.*?)\}/; // matches for strings between curly braces

/**
 * This takes the params from the collection and substitues those
 * params into a new output string in the event that things like
 * uid want to be reused.
 * @param {EventContext} context
 * @param {string} documentPath
 * @return {string}
 */
export function insertParamsIntoPath(
  context: EventContext, documentPath: string): string {
  const documentSegments = documentPath.split("/");

  const replacedSegments = documentSegments.map((value) => {
    const match = value.match(regex);
    if (match == undefined) {
      return value;
    }
    if (match.length > 1) {
      const textToReplace = match[1];
      const replacementValue = context.params[textToReplace];
      if (replacementValue == undefined || replacementValue == "") {
        logger.log("could not find a text replacement for %v", textToReplace);
        return value;
      }
      return replacementValue;
    }
    return value;
  });

  const outputStr = replacedSegments.join("/");
  return outputStr;
}
