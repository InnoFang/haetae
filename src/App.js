import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './login/login.js';
import Main from './main/main';
import PrivateRoute from './component/privateRoute/privateRoute';

class App extends Component {
  render() {
    return (
      <Router >
        <Switch>
          <Route path="/login" component={Login} />
          <PrivateRoute path="/" component={Main} />
        </Switch>
     </Router>
    );
  }
}

export default App;
