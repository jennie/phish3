import User from "~/server/models/user.schema";

export default defineEventHandler(async () => {
  const [studentCount, employeeCount] = await Promise.all([
    User.countDocuments({ type: "student" }),
    User.countDocuments({ type: "employee" }),
  ]);

  // implement the weighting formula here
  const weightedRatio = calculateWeightedRatio(studentCount, employeeCount);

  return {
    studentCount,
    employeeCount,
    weightedRatio,
  };
});

function calculateWeightedRatio(studentCount, employeeCount) {
  // TODO: Implement the weighting formula
  return studentCount / 10 / employeeCount;
}
