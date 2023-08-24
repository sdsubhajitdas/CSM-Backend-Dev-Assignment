const { User } = require("../models/User");
const { verifyAccessToken } = require("../utils/jwt");

async function checkAuthentication(req, res, next) {
  const accessToken = req.get("authorization")
    ? req.get("authorization").split(" ")[1]
    : null;

  const unauthorizedUserError = new Error(
    "Unauthorized to perform this action"
  );
  unauthorizedUserError.statusCode = 403;

  if (!accessToken) {
    throw unauthorizedUserError;
  }

  try {
    const verified = verifyAccessToken(accessToken);
    const verifiedUser = await User.findById(verified._id);
    if (!verifiedUser) {
      throw unauthorizedUserError;
    }

    req.user = verifiedUser;
  } catch (err) {
    return ["TokenExpiredError", "JsonWebTokenError"].includes(err.name)
      ? res.status(403).send("Unauthorized to perform this action")
      : res.status(500).send(err);
  }

  next();
}

module.exports = {
  checkAuthentication,
};
