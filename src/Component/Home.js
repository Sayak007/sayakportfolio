import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../Css/Home.css';
import '../animate/animate';
import '../animate/animate.css';
import db,{firebaseApp} from "../firebase.js";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {IconButton} from "@material-ui/core";
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';


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
      card_id:"",
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

  card_loader(){
    db.collection("service_cards").orderBy('card_id','desc').onSnapshot((snapshot) =>
      this.setState({card_content:snapshot.docs.map((doc) => doc.data())})
    );
  }
  async add(){
    var cardid = this.state.card_id;
    var img=this.state.card_image;
    var title=this.state.card_title;
    var desc=this.state.card_desc;
    const service_cards_ref = db.collection('service_cards');
    const snapshot = await service_cards_ref.where('card_id', '==', cardid).get();
    //console.log(snapshot)
    if (!snapshot.empty) {
      await service_cards_ref.where('card_id', '==', cardid).get().then(response=>{
        response.docs.forEach((doc) => {
          
            const docRef = db.collection('service_cards').doc(doc.id)
            //console.log(doc.data().description)
            docRef.update({
              card_id: cardid,
              image:(img===""?doc.data().image:img),
              title:(title===""?doc.data().title:title),
              description: (desc===""?doc.data().description:desc),
            })
        })
      })
    }else{
      service_cards_ref.add({
        card_id: cardid,
        image:img,
        title:title,
        description: desc,
      }).catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
    }
    this.setState({card_id:"",card_desc:"",card_title:"",card_image:""});
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
      <div className="home gray-bg" style={{marginTop: '80px'}}>
        <section id="header" className="">
          <div className="container-fluid gray-bg" style={{paddingTop:"30px"}}>
            <div className="row d-flex justify-content-center mx-auto">
              <div className="col-11 mx-auto ">
                {this.state.details.map(details=>
                <div className="row base-card justify-content-md-center">
                  <div className="col-md-6 centerh">
                    <img src={details.image} className="img-fluid img" alt="Image"/>
                  
                  </div>
                  
                  <div className="col-md-6 centerh centerv">
                    <h1 style={{fontSize:"72px"}}>
                      <strong>{details.name}</strong>
                    </h1>
                    <h5 style={{color:'#0275d8'}}>{details.designation}</h5>
                    <br/>
                    <pre style={{whiteSpace: 'pre-wrap', maxHeight:"150px",overflowY:"auto", textAlign:"left"}} className="overflowY-auto scroll-exp">{details.about}</pre>
                    <div className="mt-3">
                      <a target="_blank" href={details.resume} className="btn btn-outline-primary" style={{borderRadius:"20px"}}>
                        Get Resume
                      </a>
                    </div>
                    <div className="mt-3 social">
                      <IconButton><a target="_blank" className="icon" href="https://www.linkedin.com/in/sayak-das-041374188/"><LinkedInIcon color="primary"/></a></IconButton>
                      <IconButton><a target="_blank" className="icon" href="https://github.com/Sayak007"><GitHubIcon color="primary"/></a></IconButton>
                      <IconButton><a target="_blank" className="icon" href="https://www.facebook.com/sayak.das.735"><FacebookIcon color="primary"/></a></IconButton>
                      <IconButton><a target="_blank" className="icon" href="https://www.instagram.com/d._sayak/"><InstagramIcon color="primary"/></a></IconButton>
                      <IconButton><a target="_blank" className="icon" href="https://twitter.com/KSayak10"><TwitterIcon color="primary"/></a></IconButton>
                    </div>
                  </div>
                  {this.state.user?(<a className="btn btn-primary col-sm-1 fl" data-bs-target="#baseModal" data-bs-toggle="modal"><AddCircleIcon/></a>):""}
                </div>
                )}
              </div>
              <div style={{marginTop:"70px"}}></div>    
              <div className="separator"><h1><strong>Expertise</strong></h1></div>  
              <div className="mx-auto col-md-10">{this.state.user?(<a className="btn btn-primary col-sm-1 fl trigger-btn" data-bs-target="#cardModal" data-bs-toggle="modal"><AddCircleIcon/></a>):""}     </div>
              <div className="col-md-10 mx-auto" style={{marginTop:"50px", marginBottom:"50px"}}>
                <div className="row justify-content-center d-flex">
                {this.state.card_content.map(content=>
                  <div className="col-md-4 d-flex" style={{padding:"10px"}}>
                    <div className="col-md-11 base-card mx-auto outline-primary exp-card reveal" style={{border:"1px solid #4285F4", cursor:"pointer"}}>
                    <div className="row justify-content-center d-flex my-auto">
                      <div className='col-md-3'>
                        <img className="img-fluid imgg" style={{width:"80px",height:'auto', marginBottom:"10px"}} src={content.image}/>
                      </div>
                      <div className='col-md-9'>
                        <h3><strong>{content.title}</strong></h3>
                      </div>
                    </div>
                    <div className='row justify-content-center d-flex my-auto'>
                      <pre style={{whiteSpace: 'pre-wrap',height:"250px", paddingRight:"10px"}} className="overflowY-auto scroll-exp">{content.description}</pre>
                    </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
              <div className='mb-5 mx-auto text-center'>
                <a className='btn btn-primary btn-lg mx-auto ' style={{borderRadius:"40px"}} href="/#/contact">Hire me <ArrowForwardIcon/></a>
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
                                  <button type="button" className="close btn-outline-danger" data-bs-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div className="modal-body">
                          
                            <div className="form-group">
                              <input value={this.state.designation} onChange={e => this.setState({ designation: e.target.value })} type="text" className="form-control" name="username" placeholder="Designation" required="required"/>		
                            </div>
                            <br/>
                            <div className="form-group">
                              <textarea value={this.state.about} onChange={e => this.setState({ about: e.target.value })} type="text" className="form-control" name="password" placeholder="About" required="required" rows="4"/>	
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
                              <button onClick={this.update}  className="btn btn-primary btn-lg btn-block login-btn" data-bs-dismiss="modal">Update</button>
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
                                  <button type="button" className="close btn-outline-danger" data-bs-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                              <input value={this.state.card_id} onChange={e => this.setState({ card_id: e.target.value })} type="number" className="form-control" name="cardid" placeholder="Card Id" required="required"/>		
                            </div>
                            <br/>
                            <div className="form-group">
                              <input value={this.state.card_image} onChange={e => this.setState({ card_image: e.target.value })} type="text" className="form-control" name="username" placeholder="Image" required="required"/>		
                            </div>
                            <br/>
                            <div className="form-group">
                              <input value={this.state.card_title} onChange={e => this.setState({ card_title: e.target.value })} type="text" className="form-control" name="password" placeholder="Title" required="required"/>	
                            </div> 
                            <br/> 
                            <div className="form-group">
                              <textarea value={this.state.card_desc} onChange={e => this.setState({ card_desc: e.target.value })} type="text" className="form-control" name="password" placeholder="Description" required="required" rows="2"/>	
                            </div>
                            <br/> 
                            <div className="form-group">
                              <button onClick={this.add}  className="btn btn-primary btn-lg btn-block login-btn" data-bs-dismiss="modal">Add</button>
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