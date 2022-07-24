import React, { useEffect, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "materialize-css/dist/css/materialize.min.css";
import { connect } from "react-redux";
import * as actions from "../actions";
import Header from "./Header";
import Landing from "./Landing";
import CheckoutFormContainer from "./CheckoutFormContainer";
import Backdrop from "./Backdrop";

const Dashboard = () => <h2>Dashboard</h2>;

const App = props => {
  useEffect(() => {
    props.fetchUser();
  }, [props]);

  const [showModal, setShowModal] = useState(false);

  function addCreditsModalHandler() {
    setShowModal(true);
  }

  function closeCreditsModalHandler() {
    setShowModal(false);
  }

  return (
    <div className="container">
      <BrowserRouter>
        <div>
          <Header onAddCreditsClick={addCreditsModalHandler} />
          <Route exact path="/" component={Landing} />
          <Route exact path="/surveys" component={Dashboard} />
          <Route path="/checkout" component={CheckoutFormContainer} />
        </div>
        {showModal && <Backdrop onCancel={closeCreditsModalHandler} />}
        {showModal && <CheckoutFormContainer />}
      </BrowserRouter>
    </div>
  );
};

export default connect(null, actions)(App);
