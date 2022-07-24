const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: keys.baseURI + "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      let existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        done(null, existingUser);
      } else {
        const customer = await createStripeCustomer({
          email: profile._json.email,
          name: profile._json.name,
        });
        const user = await new User({
          googleId: profile.id,
          stripeCustomer: getStripeCustomerFields(customer),
        }).save();
        done(null, user);
      }
    }
  )
);

async function createStripeCustomer({ email, name }) {
  return new Promise(async (resolve, reject) => {
    try {
      const Customer = await stripe.customers.create({
        name,
        email,
      });
      resolve(Customer);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

function getStripeCustomerFields(customer) {
  return {
    id: customer.id,
    email: customer.email,
  };
}
