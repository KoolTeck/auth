function regFieldError(res, field, message) {
  res.status(422).json({
    errors: [
      {
        field: `${field}`,
        message: `${message}`,
      },
    ],
  });
}

function signUpError(res) {
  return res.status(400).json({
    status: "Bad request",
    message: "Registration unsuccessful",
    statusCode: 400,
  });
}
function signInError(res) {
  return res.status(401).json({
    status: "Bad request",
    message: "Authentication failed",
    statusCode: 401,
  });
}

module.exports = { regFieldError, signUpError, signInError };
