/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const Header = props => {
  console.log(props);

  function renderContent() {
    switch (props.auth) {
      case null:
        return "Still deciding";
      case false:
        return (
          <li>
            <a href="/auth/google">Login with Google</a>
          </li>
        );
      default:
        return [
          <li key={1}>
            <button className="btn" onClick={props.onAddCreditsClick}>
              Add Credits
            </button>
          </li>,
          <li key={2}>
            <a href="/api/logout">Logout</a>
          </li>,
        ];
    }
  }

  return (
    <nav>
      <div className="nav-wrapper">
        <Link className="left brand-logo" to={props.auth ? "/surveys" : "/"}>
          Emaily
        </Link>
        <ul className="right">{renderContent()}</ul>
      </div>
    </nav>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(Header);
