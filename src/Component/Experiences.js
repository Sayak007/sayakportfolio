import React, { Component } from 'react';
import db,{firebaseApp} from "../firebase.js";
import '../Css/Experience.css';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import '../animate/animate';
import '../animate/animate.css';


class Experiences extends Component {
  constructor() {
    super();
    this.state = ({
      user: null,
      details:[],
      image:"",
      designation:"",
      about:"",
      
      exp_content:[],
      exp_id:"",
      exp_image:"",
      exp_start:"",
      exp_end:"",
      exp_company:"",
      exp_desc:"",
      exp_designation:"",
      exp_techStack:"",
      exp_location:"",
    });
    this.authListener = this.authListener.bind(this);
    this.exp_loader = this.exp_loader.bind(this);
    this.update = this.update.bind(this);
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  componentDidMount() {
    this.authListener();
    this.exp_loader();
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

  exp_loader(){
    db.collection("experience").orderBy('exp_id','desc').onSnapshot((snapshot) =>
      this.setState({exp_content:snapshot.docs.map((doc) => doc.data())})
    );
  }

  async update(){
    const exp = db.collection('experience');
    const snapshot = await exp.where('exp_id', '==', this.state.exp_id).get();
    if (!snapshot.empty){
      await exp.where('exp_id', '==', this.state.exp_id).get().then(response=>{
        response.docs.forEach((doc) => {
            const docRef = db.collection('experience').doc(doc.id)
            //console.log(doc.data().description)
            docRef.update({
              exp_id:this.state.exp_id,
              exp_company:(this.state.exp_company===""?doc.data().exp_company:this.state.exp_company),
              exp_image:(this.state.exp_image===""?doc.data().exp_image:this.state.exp_image),
              exp_start:(this.state.exp_start===""?doc.data().exp_start:this.state.exp_start),
              exp_end:(this.state.exp_end===""?doc.data().exp_end:this.state.exp_end),
              exp_desc:(this.state.exp_desc===""?doc.data().exp_desc:this.state.exp_desc),
              exp_designation:(this.state.exp_designation===""?doc.data().exp_designation:this.state.exp_designation),
              exp_techStack:(this.state.exp_techStack===""?doc.data().exp_techStack:this.state.exp_techStack),
              exp_location:(this.state.exp_location===""?doc.data().exp_location:this.state.exp_location),
            })
        })
      })
    }else{
      exp.add({
        exp_id:this.state.exp_id,
        exp_company:this.state.exp_company,
        exp_image:this.state.exp_image,
        exp_start:this.state.exp_start,
        exp_end:this.state.exp_end,
        exp_desc:this.state.exp_desc,
        exp_designation:this.state.exp_designation,
        exp_techStack:this.state.exp_techStack,
        exp_location: this.state.exp_location
      })
    }

    this.setState({
      exp_id:"",
      exp_company:"",
      exp_image:"",
      exp_start:"",
      exp_end:"",
      exp_company:"",
      exp_desc:"",
      exp_designation:"",
      exp_techStack:"",
      exp_location:"",
    })
  }

  render(){ return(
    <div className="experience">
      <section className="section gray-bg" id="resume">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="section-title">
                            <h2>Experience</h2>
                            
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-11 m-15px-tb">
                        <div className="resume-box">
                            <ul>
                              {this.state.exp_content.map(content=>
                                
                                <li key={this.state.exp_content.length-content.exp_id+1} className={(this.state.exp_content.length-content.exp_id+1===1 || this.state.exp_content.length-content.exp_id+1===2) ?"":"reveal"}>
                                    <div className="icon">
                                        <img src={content.exp_image} style={{width:"40px",borderRadius:"50%",}}></img>
                                    </div>
                                    <span className="time">{content.exp_start} - {content.exp_end}</span>
                                    <h4>{content.exp_company} </h4><h6 style={{marginTop:"3px"}}>  {content.exp_location}</h6>
                                    <h5>{content.exp_designation}</h5>
                                    <pre style={{whiteSpace: 'pre-wrap'}}>{content.exp_desc}</pre>
                                    <br/>
                                    <p><b>Tech Stack: </b>{content.exp_techStack} </p>
                                </li>)}
                                {this.state.user?(<a className="btn btn-primary col-sm-1 fl trigger-btn" data-bs-target="#baseModal" data-bs-toggle="modal"><AddCircleIcon/></a>):""}
                            </ul>
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
                                  <button type="button" className="close btn-outline-danger" data-bs-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div className="modal-body">
                          
                            <div className="form-group">
                              <input value={this.state.exp_id} onChange={e => this.setState({ exp_id: e.target.value })} type="text" className="form-control" name="exp_id" placeholder="EXP ID" required="required"/>		
                            </div>
                            <br/>
                            <div className="form-group">
                              <input value={this.state.exp_company} onChange={e => this.setState({ exp_company: e.target.value })} type="text" className="form-control" name="Company" placeholder="Company" required="required"/>	
                            </div> 
                            <br/> 
                            <div className="form-group">
                              <textarea value={this.state.exp_desc} onChange={e => this.setState({ exp_desc: e.target.value })} type="text" className="form-control" name="desc" placeholder="Description" required="required"/>	
                            </div>
                            <br/>
                            <div className="form-group">
                              <input value={this.state.exp_designation} onChange={e => this.setState({ exp_designation: e.target.value })} type="text" className="form-control" name="password" placeholder="Designation" required="required"/>	
                            </div>  
                            <br/> 
                            <div className="form-group">
                              <input value={this.state.exp_start} onChange={e => this.setState({ exp_start: e.target.value })} type="text" className="form-control" name="password" placeholder="Start Date" required="required"/>	
                            </div>  
                            <br/> 
                            <div className="form-group">
                              <input value={this.state.exp_end} onChange={e => this.setState({ exp_end: e.target.value })} type="text" className="form-control" name="password" placeholder="End Date" required="required"/>	
                            </div>  
                            <br/> 
                            <div className="form-group">
                              <input value={this.state.exp_image} onChange={e => this.setState({ exp_image: e.target.value })} type="text" className="form-control" name="password" placeholder="Image Link" required="required"/>	
                            </div>  
                            <br/> 
                            <div className="form-group">
                              <input value={this.state.exp_location} onChange={e => this.setState({ exp_location: e.target.value })} type="text" className="form-control" name="password" placeholder="Location" required="required"/>	
                            </div>  
                            <br/> 
                            <div className="form-group">
                              <input value={this.state.exp_techStack} onChange={e => this.setState({ exp_techStack: e.target.value })} type="text" className="form-control" name="password" placeholder="Tech Stack" required="required"/>	
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


    </div>
  );
  };
}

export default Experiences;