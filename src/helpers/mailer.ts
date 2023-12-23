import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    console.log("~ hashedToken", hashedToken);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "" + process.env.NODEMAILER_USER,
        pass: "" + process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: "swarnpallavbhaskar3108@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<div><a href="${
        process.env.WEBSITE_URL
      }/verifyemail?token=${hashedToken}">${
        emailType === "VERIFY" ? "Verify your email" : "Reset your password"
      }</a>${process.env.WEBSITE_URL}/verifyemail?token=${hashedToken}</div>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
