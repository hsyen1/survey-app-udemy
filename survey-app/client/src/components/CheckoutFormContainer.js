import React, { useState, useEffect } from "react";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { connect } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import "../styles/CheckoutFormContainer.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CheckoutFormContainer = props => {
  console.log(props);
  const [clientSecret, setClientSecret] = useState("");
  const customer = props.auth.stripeCustomer;
  const fetch = async () => {
    const res = await axios.post("/api/create-payment-intent", {
      items: [{ id: "item-1" }],
      customer: customer,
    });
    console.log(res);
    console.log(res.data);
    setClientSecret(res.data.clientSecret);
  };

  useEffect(() => {
    fetch();
  }, []);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="checkout">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(CheckoutFormContainer);
