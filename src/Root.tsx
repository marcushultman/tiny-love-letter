import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Start from './Start';
import Game from './Game';

export default function Root() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/:token">
            <Game />
          </Route>
          <Route path="/">
            <Start />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
