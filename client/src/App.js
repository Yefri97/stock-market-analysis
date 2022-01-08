import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Seasons from './pages/Seasons';

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Seasons} />
        <Route exact path="/seasons" component={Seasons} />
      </Switch>
    </div>
  </Router>
);

export default App;