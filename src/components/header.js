import * as React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Modal } from "react-materialize";

import LoginForm from "./forms/login";
import { logoutUser } from '../actions';

const Header = ({ authenticated, secure, logout }) => (
  <header className>
    <nav className="teal darken-4 header-position">
      <Link to="/" className="brand-logo left">USMCA</Link>
      <ul id="nav-mobile" className="right">
        { authenticated && (<li><Link to="/">Notificatons</Link></li>) }
        { authenticated && (<li><Link to="/competitions">Competitions</Link></li>) }
        { authenticated && (<li><Link to="/account">Account</Link></li>) }
        { authenticated && (<li><Link to="/" onClick={ logoutUser }>Log Out</Link></li>) }
        { !authenticated && (<li><Link to="/login">Log In</Link></li>) }
      </ul>
    </nav>
    <div className= "whitespace-header">
    </div>
  </header>
);

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  authenticated: !!state.auth.authenticated.content,
  secure: state.users.user.content && state.users.user.content.isSecure
});

const mapDispatchToProps = dispatch => ({
  logout: () => logoutUser(dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
