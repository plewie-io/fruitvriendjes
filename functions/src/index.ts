import * as functions from "firebase-functions";
import { beforeUserCreated, HttpsError } from "firebase-functions/v2/identity";

// Allowed email domains for account creation
const ALLOWED_DOMAINS = [
  "handihow.com",
  "eduprompt.nl",
  "schoolfruit.nl",
];

/**
 * Blocking function that runs before a user account is created.
 * Only allows users from specific email domains to create accounts.
 */
export const beforecreated = beforeUserCreated(
  { region: "europe-west4" },
  (event) => {
  const user = event.data;

  // Allow anonymous users (they don't have email)
  if (!user.email) {
    // If you want to block anonymous users too, uncomment the next line:
    // throw new HttpsError("permission-denied", "Anonymous sign-ups are not allowed.");
    return;
  }

  // Extract and validate email domain
  const emailDomain = user.email.split("@")[1]?.toLowerCase();

  if (!emailDomain || !ALLOWED_DOMAINS.includes(emailDomain)) {
    functions.logger.warn(
      `Blocked account creation attempt from unauthorized domain: ${user.email}`
    );
    throw new HttpsError(
      "permission-denied",
      `Account creation is restricted. Only users from the following domains are allowed: ${ALLOWED_DOMAINS.join(", ")}`
    );
  }

  functions.logger.info(`Account creation allowed for: ${user.email}`);
  return;
});
