import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Redirect
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
            <GameWrapper />
          </Route>
          <Route path="/">
            <Start />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function GameWrapper() {
  let { token } = useParams<{ token: string }>();
  const me = localStorage.getItem('playerId');
  if(!me) {
    return (<Redirect to="/" />)
  }
  return (
    <div>
      <Game token={token} me={me} />
    </div>
  );
}
