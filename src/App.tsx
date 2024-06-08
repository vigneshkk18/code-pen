import { Route, Switch } from "wouter";
import Pen from "./views/pen/pen";
import Pens from "./views/pens/pens";

function App() {
  return (
    <Switch>
      <Route path="/pens/:penId" component={Pen} />
      <Route component={Pens} />
    </Switch>
  );
}

export default App;
