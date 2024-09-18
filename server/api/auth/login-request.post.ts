import { H3Event } from "h3";
import User from "~/server/models/user.schema";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default defineEventHandler(async (event: H3Event) => {
  const { email } = await readBody(event);

  // Validate email domain
  const domain = email.split("@")[1];
  let userType;
  if (domain === "myseneca.ca") userType = "student";
  else if (domain === "senecapolytechnic.ca") userType = "employee";
  else if (domain === "senecagovernors.ca") userType = "governor";
  else if (domain === "gammaspace.ca") userType = "gammaspace";
  else userType = "tester";
  // todo: reimplement domain restriction
  // else {
  //   throw createError({
  //     statusCode: 400,
  //     message: "Invalid email domain",
  //   });
  // }

  // Find or create user
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, type: userType });
    await user.save();
  }

  // Generate login token
  const token = crypto.randomBytes(32).toString("hex");
  await setUserSession(event, { loginToken: token, email });

  // Send email
  const loginUrl = `${process.env.BASE_URL}/api/auth/verify?token=${token}`;

  const msg = {
    to: email,
    from: "noreply@reelpolytechnic.com",
    subject: "Your Reel Polytechnic Login Link",
    text: `Click this link to log in: ${loginUrl}`,
    html: `<p>Click <a href="${loginUrl}">here</a> to log in to Reel Polytechnic.</p>`,
  };

  await sgMail.send(msg);

  return { message: "Login link sent to your email" };
});
