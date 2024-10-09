import { H3Event } from "h3";
import User from "~/server/models/user.schema";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default defineEventHandler(async (event: H3Event) => {
  const { email } = await readBody(event);

  if (!email) {
    throw createError({
      statusCode: 400,
      message: "Email is required",
    });
  }

  // Validate email domain
  const domain = email.split("@")[1];
  let userType;

  switch (domain) {
    case "myseneca.ca":
      userType = "student";
      break;
    case "senecapolytechnic.ca":
      userType = "employee";
      break;
    case "senecagovernors.ca":
      userType = "governor";
      break;
    case "gammaspace.ca":
      userType = "gammaspace";
      break;
    default:
      throw createError({
        statusCode: 400,
        message: "Invalid email domain. Please use a valid Seneca email.",
      });
  }

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
    from: "noreply@senecapolytechnic.org",
    subject: "Your Seneca Polytechnic Security Training Login Link",
    templateId: "d-1c3cf95fe05349a2b501093051138583",
    dynamic_template_data: {
      Weblink: loginUrl,
    },
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: "Failed to send login email. Please try again later.",
    });
  }

  return { message: "Login link sent to your email" };
});
