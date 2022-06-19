import React, { Component } from 'react';
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
import Skill from './Component/Skills'
import Cookies from 'universal-cookie';

class App extends Component {
  constructor(props){
    super(props);
    const cookies = new Cookies();
    const th = cookies.get('theme')
    if (th===null){
      cookies.set('theme', 'dark', { path: '/' })
    }
    this.state=({
      theme: cookies.get('theme'),
    })
    this.changeTheme = this.changeTheme.bind(this)
  }
  changeTheme(){
    this.setState({theme: this.state.theme==='light'?'dark':'light'})
    localStorage.setItem('theme', this.state.theme);
    const cookies = new Cookies();
    const th = cookies.get('theme')
    if(th){
      if (th==='light'){
        cookies.set('theme', 'dark', { path: '/' })
      }else{
        cookies.set('theme', 'light', { path: '/' })
      }
    }else{
      cookies.set('theme', 'dark', { path: '/' })
    }
    window.location.reload(false)
  }
  render(){
    return (
      <div className="app dark-theme">
        <Navbar changeTheme={this.changeTheme}/>
        <Switch>
          <Route exact path="/" component={Home} changeTheme={this.changeTheme}/>
          <Route exact path="/home" component={Home} changeTheme={this.changeTheme}/>
          <Route exact path="/experience" component={Experiences} changeTheme={this.changeTheme}/>
          <Route exact path="/project" component={Projects} changeTheme={this.changeTheme}/>
          <Route exact path="/contact" component={Contact} changeTheme={this.changeTheme}/>
          <Route exact path="/skill" component={Skill} changeTheme={this.changeTheme}/>
          <Redirect to="/"/>
        </Switch>
      </div>
    );
  }
}

export default App;
