import { H3Event } from "h3";
import User from "~/server/models/user.schema";
import { createObjectCsvStringifier } from "csv-writer";

export default defineEventHandler(async (event: H3Event) => {
  // Add proper admin authentication here
  const users = await User.find({}, "email type bestScore");

  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: "email", title: "Email" },
      { id: "type", title: "User Type" },
      { id: "bestScore", title: "Best Score" },
    ],
  });

  const csvString =
    csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(users);

  setHeader(event, "Content-Type", "text/csv");
  setHeader(
    event,
    "Content-Disposition",
    "attachment; filename=user-scores.csv"
  );

  return csvString;
});
