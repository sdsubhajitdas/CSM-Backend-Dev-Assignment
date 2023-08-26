const { Router } = require("express");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = Router();

router.post("/subscribe", async (req, res, next) => {
  // Create a customer
  // Create a subscription
  // Send back the client secret
  const { paymentMethod } = req.body;
  console.log(paymentMethod);
  try {
    const customer = await stripe.customers.create({
      email: req.user.email,
      name: req.user.fullName,
      payment_method: paymentMethod,
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });

    console.log(customer);
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_PRO_SUBSCRIPTION_PRICE_ID }],
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });

    res.send({
      subscription,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
