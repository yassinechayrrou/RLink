const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

/* Register block */
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  // console.log(req.body);

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/* Login block */
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // res.status(400).json({
    //   success: false,
    //   error: "Please provide and email or password",
    // });
    return next(new ErrorResponse("Missing email or password", 401));
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // res.status(404).json({
      //   success: false,
      //   error: "Invalid credentials",
      // });
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      // res.status(404).json({
      //   success: false,
      //   error: "Invalid crededentials",
      // });
      return next(new ErrorResponse("Invalid Credentials", 404));
    }

    //generates a jsonwebtoken and send it as response
    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/* ForgotPassword Block*/
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Verify email could not be sent"));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetPasswordURL = `http://localhost:1234/passwordreset/${resetToken}`;

    const message = `
    <h1>A password change have been requested</h1>
    <p>Please go to this link to continue</p>
    <a href="${resetPasswordURL} clickTracking=off>${resetPasswordURL}</a>
    `;
  } catch (error) {}
  res.send("Forgot Password Route");
};

/* ResetPassword Block*/
exports.resetPassword = (req, res, next) => {
  res.send("Reset Password Route");
};

const sendToken = (user, statusCode, res) => {
  const token = user.getToken();
  // console.log(token);
  res.status(statusCode).json({ success: true, token });
};