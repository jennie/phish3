import { H3Event, sendStream, send } from "h3";
import User from "~/server/models/user.schema";
import { createObjectCsvStringifier } from "csv-writer";

export default defineEventHandler(async (event: H3Event) => {
  const users = await User.find(
    {},
    "email type bestScore latestScore lastLoginAt lastPlayedAt"
  );

  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: "email", title: "Email" },
      { id: "type", title: "Type" },
      { id: "bestScore", title: "Best Score" },
      { id: "latestScore", title: "Latest Score" },
      { id: "lastLoginAt", title: "Last Login" },
      { id: "lastPlayedAt", title: "Last Played" },
    ],
  });

  const records = users.map((user) => ({
    email: user.email,
    type: user.type,
    bestScore: user.bestScore,
    latestScore: user.latestScore,
    lastLoginAt: user.lastLoginAt
      ? new Date(user.lastLoginAt).toISOString()
      : "",
    lastPlayedAt: user.lastPlayedAt
      ? new Date(user.lastPlayedAt).toISOString()
      : "",
  }));

  const csvContent =
    csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

  event.node.res.setHeader("Content-Type", "text/csv");
  event.node.res.setHeader(
    "Content-Disposition",
    'attachment; filename="users.csv"'
  );

  return send(event, csvContent);
});
