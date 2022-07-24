import React, { useEffect, useState } from "react";
import "../styles/CheckoutFormContainer.css";
import { useHistory } from "react-router-dom";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDone, setIsPaymentDone] = useState(false);

  useEffect(() => {
    console.log("testing");
    if (!stripe) {
      return;
    }

    setIsLoading(false);

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent) {
        case "succeeded":
          setMessage("Payment succeeded!");
          console.log(message);
          history.replace("/surveys");
          break;
        case "processing":
          setMessage("Your payment is processing");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          console.log("hello");
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, isLoading, paymentDone]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/surveys",
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      console.log(error.message);
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsPaymentDone(true);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {isLoading ? null : <header className="title">$5 for 5 credits</header>}
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
