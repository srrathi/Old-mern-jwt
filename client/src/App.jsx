import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login"  component={Login} />
        <Route path="/register"  component={Register} />
        <Route path="/dashboard"  component={Dashboard} />
    </Switch>
  );
}

export default App;
