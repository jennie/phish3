import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  await clearUserSession(event);
  return { message: "Logged out successfully" };
});
