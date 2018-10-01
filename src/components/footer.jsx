import * as React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer>
    <div className = "whitespace-footer">
    </div>
    <div className="page-footer footer-copyright teal darken-4 center footer-position">
      <div className="container">
        <ul className="grey-text text-lighten-3">
          <li>&copy; 2017 USMCA</li>
          <li><Link to="/about" className="grey-text text-lighten-3">About</Link></li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
