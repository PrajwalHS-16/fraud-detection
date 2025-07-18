import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Analyze from './pages/Analyze';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Analyze} />
      </Switch>
    </Router>
  );
}

export default App;