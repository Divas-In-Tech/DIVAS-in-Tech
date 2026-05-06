import { isProfane } from "no-profanity";

export const INAPPROPRIATE_MESSAGE_ERROR = "Please ensure your message is appropriate.";

export function containsInappropriateLanguage(message: string) {
  return isProfane(message.trim());
}
