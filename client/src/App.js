import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './components/Login';
import Home from './components/Home';
import Page404 from './components/404';
import InvalidConnection from './components/InvalidConnection';
import JoinRejected from './components/JoinRejected';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/login/:room" component={Login} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/invalid" component={InvalidConnection} />
          <Route exact path="/rejected" component={JoinRejected} />
          <Route component={Page404} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
