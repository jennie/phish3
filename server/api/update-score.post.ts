import { H3Event } from "h3";
import User from "~/server/models/user.schema";

export default defineEventHandler(async (event: H3Event) => {
  const { score } = await readBody(event);
  const session = await requireUserSession(event);

  const user = await User.findById(session.user.id);
  if (!user) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  if (score > user.bestScore) {
    user.bestScore = score;
    await user.save();
    session.user.bestScore = score;
    await setUserSession(event, session);
  }

  return { message: "Score updated successfully", bestScore: user.bestScore };
});
