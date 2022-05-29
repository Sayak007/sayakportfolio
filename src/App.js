import React from 'react';
import './App.css';
//import './bootstrap/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
//import 'bootstrap/dist/css/bootstrap.css';
import {Switch,Route, Redirect} from "react-router-dom";
import Home from "./Component/Home.js";
import Navbar from "./Navbar/Navbar.js";
import Experiences from "./Component/Experiences.js";
import Contact from './Component/Contact';
import Projects from './Component/Projects'

function App() {
  return (
    <div className="app">
      <Navbar/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/home" component={Home}/>
        <Route exact path="/experience" component={Experiences}/>
        <Route exact path="/project" component={Projects}/>
        <Route exact path="/contact" component={Contact}/>
        <Redirect to="/"/>
      </Switch>
    </div>
  );
}

export default App;
