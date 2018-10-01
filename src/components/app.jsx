import * as React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';

import Header from './header.jsx';
import Routes from './routes.jsx';
import Footer from './footer.jsx';

const App = () => (
  <BrowserRouter>
    <div>
      <Header />
      <Routes />
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;
