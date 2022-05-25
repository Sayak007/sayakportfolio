import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../Css/Home.css';
import db,{firebaseApp} from "../firebase.js";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {IconButton} from "@material-ui/core";
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';


class Home extends Component {
  constructor() {
    super();
    this.state = ({
      user: null,
      details:[],
      image:"",
      resume:"",
      designation:"",
      about:"",
      card_colors:['#FFC5C5','#D8FFC5','#C5FFF6','#D9C5FF','#FFC5DE'],
      card_content:[],
      card_image:"",
      card_title:"",
      card_desc:"",
    });
    this.authListener = this.authListener.bind(this);
    this.update=this.update.bind(this);
    this.card_loader=this.card_loader.bind(this);
    this.add=this.add.bind(this);
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  componentDidMount() {
    this.authListener();
    this.card_loader();
    db.collection("user").onSnapshot((snapshot) =>
      this.setState({details:snapshot.docs.map((doc) => doc.data())})
    );
    console.log(this.state.details);
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

  card_loader(){
    db.collection("service_cards").onSnapshot((snapshot) =>
      this.setState({card_content:snapshot.docs.map((doc) => doc.data())})
    );
  }
  add(){
    var img=this.state.card_image;
    var title=this.state.card_title;
    var desc=this.state.card_desc;
    db.collection('service_cards').add({
      image:img,
      title:title,
      description: desc,
    });
    this.setState({card_desc:"",card_title:"",card_image:""});
  }

  update(){
    var ref=db.collection('user').doc('ZZOnHSmwZte7wqiL6Hip');
    var about=this.state.about;
    var designation=this.state.designation;
    var image=this.state.image;
    var resume=this.state.resume;
    this.state.details.map(details=>{
      if(about==="")
        about=details.about;
      if(designation==="")
        designation=details.designation;
      if(image==="")
        image=details.image;
      if(resume==="")
        resume=details.resume;
    })
    ref.update({
      about: about,
      designation: designation,
      image: image,
      resume: resume,
    })
    .then(function() {
      console.log("Document successfully updated!");
      this.setState({
        image:"",
        resume:"",
        designation:"",
        about:"",
      });
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
    this.setState({
      image:"",
      resume:"",
      designation:"",
      about:"",
    });
  }

  render(){
    return (
      <div className="home">
        <section id="header" className="">
          <div className="container-fluid" style={{marginTop:"30px"}}>
            <div className="row d-flex justify-content-center">
              <div className="col-11 mx-auto ">
                {this.state.details.map(details=>
                <div className="row base-card justify-content-md-center animate">
                  <div className="col-md-6 centerh">
                    <img src={details.image} className="img-fluid animate img" alt="Image"/>
                  
                  </div>
                  
                  <div className="col-md-6 centerh centerv animate">
                    <h1 style={{fontSize:"72px"}}>
                      <strong>{details.name}</strong>
                    </h1>
                    <h5 style={{color:'#0275d8'}}>{details.designation}</h5>
                    <br/>
                    <p>{details.about}</p>
                    <div className="mt-3">
                      <a target="_blank" href={details.resume} className="btn btn-outline-primary">
                        Get Resume
                      </a>
                    </div>
                    <div className="mt-3 social">
                      <IconButton><a target="_blank" href="https://www.linkedin.com/in/sayak-das-041374188/"><LinkedInIcon color="primary"/></a></IconButton>
                      <IconButton><a target="_blank" href="https://github.com/Sayak007"><GitHubIcon color="primary"/></a></IconButton>
                      <IconButton><a target="_blank" href="https://www.facebook.com/sayak.das.735"><FacebookIcon color="primary"/></a></IconButton>
                      <IconButton><a target="_blank" href="https://www.instagram.com/d._sayak/"><InstagramIcon color="primary"/></a></IconButton>
                      <IconButton><a target="_blank" href="https://twitter.com/KSayak10"><TwitterIcon color="primary"/></a></IconButton>
                    </div>
                  </div>
                  {this.state.user?(<a className="btn btn-primary col-sm-1 fl" href="#baseModal" classname="trigger-btn" data-toggle="modal"><AddCircleIcon/></a>):""}
                </div>
                )}
              </div>
              <div style={{marginTop:"70px"}}></div>    
              <div className="separator animate"><h1><strong>Expertise</strong></h1></div>       
              <div className="col-md-10 mx-auto" style={{marginTop:"50px"}}>
                <div className="row justify-content-center d-flex">
                {this.state.card_content.map(content=>
                  <div className="col-md-4 d-flex" style={{padding:"10px"}}>
                    <div className="col-md-11 base-card animate mx-auto" style={{backgroundColor:this.state.card_colors[Math.floor(Math.random()*5)]}}>
                    <div className="row justify-content-center">
                      <img className="img-fluid animate imgg" style={{width:"175px",height:"150px"}} src={content.image}/>
                    </div>
                    <div className="row justify-content-center animate" style={{textAlign:"center"}}>
                      <h3><strong>{content.title}</strong></h3>
                      <p>{content.description}</p>
                    </div>
                    </div>
                  </div>
                )}
                {this.state.user?(
                  <div className="col-md-4 centerv trigger-btn hov" href="#cardModal" data-toggle="modal">
                    <div className="col-md-11 base-card animate mx-auto bg-primary hov1" style={{cursor:'pointer'}}>
                    <div className="row justify-content-center">
                      <img className="img-fluid animate imgg" style={{width:"175px",height:"150px"}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS8yLQ36QZHcE6IEzCByX4d1xAWFDq5K8hvcg&usqp=CAU"/>
                    </div>
                    <div className="row justify-content-center animate" style={{textAlign:"center"}}>
                      <h3 style={{color:"white"}}><strong>Add new expertise</strong></h3>
                      
                    </div>
                    </div>
                  </div>):("")}

                </div>
              </div>
            </div>
          </div>
        </section>
        <div id="baseModal" className="modal fade">
                    <div className="modal-dialog modal-login">
                      <div className="modal-content">
                        <div className="modal-header">
                          <div className="avatar">
                            <img src="https://img.icons8.com/color/48/000000/administrator-male--v1.png" alt="Avatar"/>
                          </div>				
                          <h4 className="modal-title">Basic Details</h4>	
                                  <button type="button" className="close btn-outline-danger" data-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div className="modal-body">
                          
                            <div className="form-group">
                              <input value={this.state.designation} onChange={e => this.setState({ designation: e.target.value })} type="text" className="form-control" name="username" placeholder="Designation" required="required"/>		
                            </div>
                            <br/>
                            <div className="form-group">
                              <input value={this.state.about} onChange={e => this.setState({ about: e.target.value })} type="text" className="form-control" name="password" placeholder="About" required="required"/>	
                            </div> 
                            <br/> 
                            <div className="form-group">
                              <input value={this.state.resume} onChange={e => this.setState({ resume: e.target.value })} type="text" className="form-control" name="password" placeholder="Resume Link" required="required"/>	
                            </div>
                            <br/>
                            <div className="form-group">
                              <input value={this.state.image} onChange={e => this.setState({ image: e.target.value })} type="text" className="form-control" name="password" placeholder="Image Link" required="required"/>	
                            </div>  
                            <br/>    
                            <div className="form-group">
                              <button onClick={this.update}  className="btn btn-primary btn-lg btn-block login-btn" data-dismiss="modal">Update</button>
                            </div>
                          
                        </div>
                        <div className="modal-footer">
                          <a href="#"></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="cardModal" className="modal fade">
                    <div className="modal-dialog modal-login">
                      <div className="modal-content">
                        <div className="modal-header">
                          <div className="avatar">
                            <img src="https://img.icons8.com/color/48/000000/administrator-male--v1.png" alt="Avatar"/>
                          </div>				
                          <h4 className="modal-title">Add Expertise</h4>	
                                  <button type="button" className="close btn-outline-danger" data-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div className="modal-body">
                          
                            <div className="form-group">
                              <input value={this.state.card_image} onChange={e => this.setState({ card_image: e.target.value })} type="text" className="form-control" name="username" placeholder="Image" required="required"/>		
                            </div>
                            <br/>
                            <div className="form-group">
                              <input value={this.state.card_title} onChange={e => this.setState({ card_title: e.target.value })} type="text" className="form-control" name="password" placeholder="Title" required="required"/>	
                            </div> 
                            <br/> 
                            <div className="form-group">
                              <input value={this.state.card_desc} onChange={e => this.setState({ card_desc: e.target.value })} type="text" className="form-control" name="password" placeholder="Description" required="required"/>	
                            </div>
                            <br/> 
                            <div className="form-group">
                              <button onClick={this.add}  className="btn btn-primary btn-lg btn-block login-btn" data-dismiss="modal">Add</button>
                            </div>
                          
                        </div>
                        <div className="modal-footer">
                          <a href="#"></a>
                        </div>
                      </div>
                    </div>
                  </div>
      </div>
    );
  };
}

export default Home;