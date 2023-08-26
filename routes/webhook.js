const { Router } = require("express");

const router = Router();

router.post("/stripe", async (req, res) => {
  // console.log(req.body);
  res.send({});
});

module.exports = router;
