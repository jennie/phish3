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
  const previousBestScore = user.bestScore || 0;
  let isNewBestScore = false;

  user.latestScore = score;
  user.lastPlayedAt = new Date();

  if (score > previousBestScore) {
    user.bestScore = score;
    session.user.bestScore = score;
    await setUserSession(event, session);
    isNewBestScore = true;
  }

  await user.save();

  return {
    message: "Score updated successfully",
    latestScore: user.latestScore,
    bestScore: user.bestScore,
    isNewBestScore: isNewBestScore,
  };
});
