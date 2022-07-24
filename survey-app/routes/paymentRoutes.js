const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const mongoose = require("mongoose");

const User = mongoose.model("users");

module.exports = app => {
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              product_data: {
                name: "Learn React",
              },
              unit_amount: 1000,
            },
          },
        ],
        success_url: "http://localhost:3000/survey",
        cancel_url: "http://localhost:3000/",
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/create-payment-intent", async (req, res) => {
    const payload = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: "usd",
      customer: payload.customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  });

  app.post("/webhook", async (req, res) => {
    const event = req.body;

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("Received payment intent succeeded webhook.");

        // add credits to customer
        const { customer } = paymentIntent;
        let user = await User.findOne({ "stripeCustomer.id": customer });
        console.log("Before updating credits: ", user.credits);
        user.credits += 5;
        user = await user.save();
        console.log("After updating credits: ", user.credits);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        console.log("PaymentMethod was attached to a Customer!");
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.send({ received: true });
  });
};
