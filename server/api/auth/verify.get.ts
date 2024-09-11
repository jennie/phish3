import { H3Event } from "h3";
import User from "~/server/models/user.schema";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const token = query.token as string;

  if (!token) {
    return sendRedirect(event, "/login?error=missing_token");
  }

  const session = await getUserSession(event);

  if (session.loginToken !== token) {
    return sendRedirect(event, "/login?error=invalid_token");
  }

  const user = await User.findOne({ email: session.email });
  if (!user) {
    return sendRedirect(event, "/login?error=user_not_found");
  }

  // Update user's last login time if needed
  user.lastLoginAt = new Date();
  await user.save();

  // Set the user session
  await setUserSession(event, {
    user: {
      id: user._id,
      email: user.email,
      type: user.type,
      bestScore: user.bestScore,
    },
  });

  // Redirect to the game start page or dashboard
  return sendRedirect(event, "/");
});
