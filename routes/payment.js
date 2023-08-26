const { Router } = require("express");
const { User } = require("../models/User");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = Router();

router.post("/subscribe", async (req, res, next) => {
  // Create/Get a customer
  // Create a subscription
  // Send back the client secret
  const { paymentMethod } = req.body;
  try {
    const customerId = req.user.subscription.stripeCustomerId;
    const customer = customerId
      ? { id: customerId }
      : await stripe.customers.create({
          email: req.user.email,
          name: req.user.fullName,
          payment_method: paymentMethod,
          invoice_settings: {
            default_payment_method: paymentMethod,
          },
        });

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
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      customer,
      subscription,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/success", async (req, res, next) => {
  try {
    const { customer, subscription } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        subscription: {
          tier: "PRO",
          createTimestamp: new Date(subscription.created * 1000).toISOString(),
          expiryTimestamp: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
          stripeCustomerId: customer.id,
          stripeSubscriptionId: subscription.id,
        },
      },
      { new: true }
    );

    res.send({ message: "Payment Successful", user: user });
  } catch (err) {
    next(err);
  }
});

router.post("/unsubscribe", async (req, res, next) => {
  try {
    const subscriptionId = req.user.subscription.stripeSubscriptionId;
    if (subscriptionId) {
      await stripe.subscriptions.cancel(subscriptionId);
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          subscription: {
            tier: "FREE",
            createTimestamp: null,
            expiryTimestamp: null,
            stripeSubscriptionId: null,
            stripeCustomerId: req.user.subscription.stripeCustomerId,
          },
        },
        { new: true }
      );

      res.send({ message: "Subscription Cancelled", user: user });
    } else {
      const error = new Error("No active subscription");
      error.statusCode = 400;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
