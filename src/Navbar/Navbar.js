import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {NavLink} from "react-router-dom";
import "./Navbar.css";
import db,{firebaseApp} from "../firebase.js";
import HomeIcon from '@material-ui/icons/Home';
import WorkIcon from '@material-ui/icons/Work';
import ContactMailIcon from '@material-ui/icons/ContactMail'
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined'
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun,faMoon , faRightToBracket, faRightFromBracket , faDial} from '@fortawesome/free-solid-svg-icons'
import { light } from '@material-ui/core/styles/createPalette';
import Cookies from 'universal-cookie';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: '',
      password: '',
      user:null,
      details:[],
      show: false,
      stylePath: 'darkTheme.css',
    };
  }
  componentDidMount() {
    this.authListener();
    db.collection("user").onSnapshot((snapshot) =>
      this.setState({details:snapshot.docs.map((doc) => doc.data())})
    );
    console.log(localStorage.getItem('theme'))
    var url = `darkTheme.css`
    const style= document.createElement("link")
    style.href='#'
    style.id='cssdark'
    style.rel="stylesheet"
    style.async=true
    document.head.appendChild(style)
    //const style= import(url)
    //this.addDark(url)
    this.getCookie('theme')==='dark'? this.addDark(url): this.removeDark();
  }
  getCookie(key){
    const cookies = new Cookies();
    return cookies.get(key)
  }
  addDark(url){
    const style=document.getElementById('cssdark')
    style.href=url
  }
  removeDark(){
    const style=document.getElementById('cssdark')
    style.href='#'
  }

  authListener() {
    firebaseApp.auth().onAuthStateChanged((user) => {
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
    this.setState({show:false})
  }
  logout() {
    firebaseApp.auth().signOut();
  }
  render(){
    return (
      <div className="Navv">
      {/*<link rel="stylesheet" type="text/css" href={this.state.stylePath}/>*/}
      <div className=" nav-bg">
        <div className="row" style={{backgroundColor: "#D0DADC"}}>
          <div className="col-11 mx-auto" style={{position:"relative"}}>
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
              {this.state.details.map(details=>
                <NavLink className="navbar-brand" to="/"><img src="https://firebasestorage.googleapis.com/v0/b/portfolio-f7924.appspot.com/o/Sayak%20Das%20(1).gif?alt=media&token=d8796914-c0ad-45e4-b888-c25794acb765" style={{borderRadius:"50%", border:"3px solid #4285F4"}} width="50px" height="50px"/></NavLink>
              )}
              <div className={this.getCookie('theme')==='dark'?'light-mode':'dark-mode'}>
                <FontAwesomeIcon icon={this.getCookie('theme')==='dark'?faSun:faMoon} onClick={this.props.changeTheme} size="2x"/>
              </div>
              <button className="navbar-toggler" type="button" style={{border: '4px solid #0275d8', borderRadius: '10px', color:'#0275d8'}} onClick={()=>this.setState({show:!this.state.show})}>
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className={`collapse navbar-collapse right-end  ${this.state.show ? "show" : ""}`} id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
                  <li className="nav-item" key="1">
                    <NavLink activeClassName="menu_active" className="nav-link" onClick={()=>this.setState({show:false})} aria-current="page" to="/home"><HomeIcon/> Home</NavLink>
                  </li>
                  <li className="nav-item" key="2">
                    <NavLink activeClassName="menu_active" className="nav-link" onClick={()=>this.setState({show:false})}  to="/experience"><WorkIcon/> Experiences</NavLink>
                  </li>
                  <li className="nav-item" key="3">
                    <NavLink activeClassName="menu_active" className="nav-link" onClick={()=>this.setState({show:false})} to="/project"><AssignmentOutlinedIcon/> Project</NavLink>
                  </li>
                  <li className="nav-item" key="4">
                    <NavLink activeClassName="menu_active" className="nav-link" onClick={()=>this.setState({show:false})} to="/skill"><SettingsApplicationsIcon/> Skills</NavLink>
                  </li>
                  <li className="nav-item" key="5">
                    <NavLink activeClassName="menu_active" className="nav-link" onClick={()=>this.setState({show:false})} to="/contact"><ContactMailIcon/> Contact</NavLink>
                  </li>
                </ul>
                  <hr/>
                  {this.state.user ?
                  (<a className="btn btn-danger d-flex" style={{borderRadius:"40px"}} onClick={this.logout}>Sign Out <FontAwesomeIcon style={{marginTop:"5px", marginLeft:'10px'}} icon={faRightFromBracket}/></a>):
                  (<a className="btn btn-success d-flex" style={{borderRadius:"40px"}} data-bs-target="#myModal" data-bs-toggle="modal">Sign In <FontAwesomeIcon style={{marginTop:"5px", marginLeft:'10px'}} icon={faRightToBracket}/></a>)}
                

                <div id="myModal" className="modal fade text-center">
                  <div className="modal-dialog modal-login">
                    <div className="modal-content">
                      <div className="modal-header">
                        <div className="avatar">
                          <img src="https://img.icons8.com/color/48/000000/administrator-male--v1.png" alt="Avatar"/>
                        </div>				
                        <h4 className="modal-title">User Login</h4>	
                                <button type="button" className="close btn-outline-danger" data-bs-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        
                          <div className="form-group">
                            <input value={this.state.email} onChange={e => this.setState({ email: e.target.value })} type="text" className="form-control" name="username" placeholder="Username" required="required"/>		
                          </div>
                          <br/>
                          <div className="form-group">
                            <input value={this.state.password} onChange={e => this.setState({ password: e.target.value })} type="password" className="form-control" name="password" placeholder="Password" required="required"/>	
                          </div>   
                          <br/>     
                          <div className="form-group text-center">
                            <button onClick={this.login}  className="btn btn-primary " data-bs-dismiss="modal">Login</button>
                          </div>
                        
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