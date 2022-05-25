import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {NavLink} from "react-router-dom";
import "./Navbar.css";
import {firebaseApp} from "../firebase.js";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: '',
      password: '',
      user:null
    };
  }
  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({ user });
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null });
        localStorage.removeItem('user');
      }
    });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login(e) {
    e.preventDefault();
    firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
    }).catch((error) => {
        console.log(error);
      });
    this.setState({email:"",password:""});
  }
  logout() {
    firebaseApp.auth().signOut();
  }
  render(){
    return (
      <div>
      <div classNameName="container-fluid nav-bg">
        <div className="row" style={{backgroundColor: "#D0DADC"}}>
          <div className="col-10 mx-auto">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
              {this.state.user ?
              (<NavLink className="navbar-brand" to="/"><img src="https://pbs.twimg.com/profile_images/1144517764838617088/TjJRCx-k_400x400.jpg" style={{borderRadius:"50%"}} width="40px" height="40px"/></NavLink>):
              ("")}
              <NavLink className="navbar-brand" to="/"><h3><strong>Sayak Portfolio</strong></h3></NavLink>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <NavLink activeClassName="menu_active" className="nav-link" aria-current="page" to="/home">Home</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink activeClassName="menu_active" className="nav-link" to="/experience">Experiences</NavLink>
                  </li>
                </ul>
                <a activeClassName="menu_active" target="_blank" className="btn btn-warning" style={{marginRight:"10px"}} href="http://portfolio-f7924.web.app/">Old Website</a>
                  {this.state.user ?
                  (<a className="btn btn-primary" onClick={this.logout}>Sign Out</a>):
                  (<a className="btn btn-primary" href="#myModal" classname="trigger-btn" data-toggle="modal">Sign In</a>)}
                

                <div id="myModal" className="modal fade">
    <div className="modal-dialog modal-login">
      <div className="modal-content">
        <div className="modal-header">
          <div className="avatar">
            <img src="https://img.icons8.com/color/48/000000/administrator-male--v1.png" alt="Avatar"/>
          </div>				
          <h4 className="modal-title">User Login</h4>	
                  <button type="button" className="close btn-outline-danger" data-dismiss="modal" aria-hidden="true">&times;</button>
        </div>
        <div className="modal-body">
          
            <div className="form-group">
              <input value={this.state.email} onChange={e => this.setState({ email: e.target.value })} type="text" className="form-control" name="username" placeholder="Username" required="required"/>		
            </div>
            <div className="form-group">
              <input value={this.state.password} onChange={e => this.setState({ password: e.target.value })} type="password" className="form-control" name="password" placeholder="Password" required="required"/>	
            </div>        
            <div className="form-group">
              <button onClick={this.login}  className="btn btn-primary btn-lg btn-block login-btn" data-dismiss="modal">Login</button>
            </div>
          
        </div>
        <div className="modal-footer">
          <a href="#">Forgot Password?</a>
        </div>
      </div>
    </div>
  </div>    
              </div>
            </div>
          </nav>
          </div>

        </div>
      </div>

      </div>
    );
  };
}

export default Navbar;