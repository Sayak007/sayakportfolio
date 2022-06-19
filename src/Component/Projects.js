import React,{Component} from 'react'
import db,{firebaseApp} from "../firebase.js";
import '../Css/Project.css'
import {IconButton} from "@material-ui/core";
import GitHubIcon from '@material-ui/icons/GitHub';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import InsertLinkOutlinedIcon from '@material-ui/icons/InsertLinkOutlined';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faCodeBranch, faBookOpenReader} from '@fortawesome/free-solid-svg-icons'
import AddCircleIcon from '@material-ui/icons/AddCircle';

class Projects extends Component {
    constructor() {
        super();
        this.state = ({
            user: null,
            details:[],
            image:"",
            designation:"",
            about:"",
            
            project_content:[],
            project_id:"",
            project_name:"",
            project_desc:"",
            project_image:"",
            project_link:"",
            project_repo:"",
            project_readme:"",
            project_skills:""
        });
        this.authListener = this.authListener.bind(this);
        this.project_loader = this.project_loader.bind(this);
        this.update = this.update.bind(this);
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    componentDidMount() {
        this.authListener();
        this.project_loader();
        db.collection("user").onSnapshot((snapshot) =>
          this.setState({details:snapshot.docs.map((doc) => doc.data())})
        );
        console.log(this.state.details);
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
    
    project_loader(){
        db.collection("projects").orderBy('project_id','desc').onSnapshot((snapshot) =>
          this.setState({project_content:snapshot.docs.map((doc) => doc.data())})
        );
    }

    async update(){
        const exp = db.collection('projects');
        const snapshot = await exp.where('project_id', '==', this.state.project_id).get();
        if (!snapshot.empty){
            await exp.where('project_id', '==', this.state.project_id).get().then(response=>{
            response.docs.forEach((doc) => {
                const docRef = db.collection('projects').doc(doc.id)
                //console.log(doc.data().description)
                docRef.update({
                    project_id:this.state.project_id,
                    project_name:(this.state.project_name===""?doc.data().project_name:this.state.project_name),
                    project_desc:(this.state.project_desc===""?doc.data().project_desc:this.state.project_desc),
                    project_image:(this.state.project_image===""?doc.data().project_image:this.state.project_image),
                    project_link:(this.state.project_link===""?doc.data().project_link:this.state.project_link),
                    project_repo:(this.state.project_repo===""?doc.data().project_repo:this.state.project_repo),
                    project_readme:(this.state.project_readme===""?doc.data().project_readme:this.state.project_readme),
                    project_skills: (this.state.project_skills===""?doc.data().project_skills:this.state.project_skills)
                })
            })
          })
        }else{
          exp.add({
            project_id:this.state.project_id,
            project_name:this.state.project_name,
            project_desc:this.state.project_desc,
            project_image:this.state.project_image,
            project_link:this.state.project_link,
            project_repo:this.state.project_repo,
            project_readme:this.state.project_readme,
            project_skills:this.state.project_skills,
          })
        }
    
        this.setState({
            project_id:"",
            project_name:"",
            project_desc:"",
            project_image:"",
            project_link:"",
            project_repo:"",
            project_readme:"",
            project_skills:"",
        })
    }
    

    render(){return (
        <div className='Project  gray-bg' style={{marginTop: '80px'}}>

            <div className="section gray-bg" >
                <div className="proj mx-auto ">
                    <div className="row">
                    <div className="col-lg-6">
                      <div className="section-title"> 
                        <h2>Projects</h2>
                                
                      </div>
                    </div>
                    </div>

                    <div className='row justify-content-center d-flex'>
                        {this.state.project_content.map(content=>
                        <div className={content.project_id%2==0?'col-md-4 d-flex animate-left':'col-md-4 d-flex animate-right'} style={{marginBottom:"40px"}}>
                            <div className='col-md-11 base-card1 mx-auto' style={{position:"relative"}}>
                                <h5 className="card-title" style={{fontWeight:"bold",padding:"10px"}}>{content.project_name}</h5>
                                <img src={content.project_image} className="card-img-top" alt="..." 
                                style={{ height: "200px", objectFit: "scale-down"}}/>
                                <div className="card-body" style={{marginBottom:"10px"}}>
                                    
                                    <pre className="card-text overflowY-auto scroll-exp" style={{whiteSpace: 'pre-wrap', maxHeight:"100px",overflowY:"auto", textAlign:"left",fontSize:"12px", marginBottom:'25px'}}>{content.project_desc}</pre>
                                    <div className='row justify-content-start overflowX-auto scroll-exp' style={{marginLeft: '-20px', marginRight:'0px',marginBottom:'25px'}}>
                                      { content.project_skills.split(",").map(skill=>
                                        <div style={{width:"fit-content"}}>
                                          <div className='bg-tech tech'>
                                            {skill}
                                          </div>
                                        </div>
                                      )}
                                      
                                    </div>
                                    
                                    <div className='d-flex' style={{position:'absolute', bottom:'5px'}}>
                                        <a target="_blank" className="Icon" href={content.project_link}><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a>
                                        <a target="_blank" className="Icon" href={content.project_repo}><FontAwesomeIcon icon={faCodeBranch} /></a>
                                        <a target="_blank" className="Icon" href={content.project_readme}><FontAwesomeIcon icon={faBookOpenReader} /></a>
                                        <a target="_blank" className="Icon" style={{padding: "7px 8px 7px 8px"}} href="https://github.com/Sayak007"><GitHubIcon style={{height:"17px"}}/></a>
                                    </div>
                                </div>
                                <div className="ID">Id: f792400{content.project_id}</div> 
                            </div>
                        </div>)}
                    </div>
                </div>
                {this.state.user?(<a className="btn btn-primary col-sm-1 fl trigger-btn" data-bs-target="#baseModal" data-bs-toggle="modal"><AddCircleIcon/></a>):""}
                
            </div>
            <div id="baseModal" className="modal fade">
                    <div className="modal-dialog modal-login">
                      <div className="modal-content">
                        <div className="modal-header">
                          <div className="avatar">
                            <img src="https://img.icons8.com/color/48/000000/administrator-male--v1.png" alt="Avatar"/>
                          </div>				
                          <h4 className="modal-title">Project Details</h4>	
                                  <button type="button" className="close btn-outline-danger" data-bs-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div className="modal-body">
                          
                            <div className="form-group">
                              <input value={this.state.project_id} onChange={e => this.setState({ project_id: e.target.value })} type="text" className="form-control" name="exp_id" placeholder="Project ID" required="required"/>		
                            </div>
                            <br/>
                            <div className="form-group">
                              <input value={this.state.project_name} onChange={e => this.setState({ project_name: e.target.value })} type="text" className="form-control" name="Company" placeholder="Name" required="required"/>	
                            </div> 
                            <br/> 
                            <div className="form-group">
                              <textarea value={this.state.project_desc} onChange={e => this.setState({ project_desc: e.target.value })} type="text" className="form-control" name="desc" placeholder="Description" required="required"/>	
                            </div>
                            <br/>
                            <div className="form-group">
                              <input value={this.state.project_image} onChange={e => this.setState({ project_image: e.target.value })} type="text" className="form-control" name="password" placeholder="Image Link" required="required"/>	
                            </div>  
                            <br/> 
                            <div className="form-group">
                              <input value={this.state.project_link} onChange={e => this.setState({ project_link: e.target.value })} type="text" className="form-control" name="password" placeholder="Project Live Link" required="required"/>	
                            </div>  
                            <br/> 
                            <div className="form-group">
                              <input value={this.state.project_repo} onChange={e => this.setState({ project_repo: e.target.value })} type="text" className="form-control" name="password" placeholder="Project Github Repository" required="required"/>	
                            </div>  
                            <br/> 
                            <div className="form-group">
                              <input value={this.state.project_readme} onChange={e => this.setState({ project_readme: e.target.value })} type="text" className="form-control" name="password" placeholder="Project Readme Link" required="required"/>	
                            </div>  
                            <br/>  
                            <div className="form-group">
                              <input value={this.state.project_skills} onChange={e => this.setState({ project_skills: e.target.value })} type="text" className="form-control" name="password" placeholder="Project Tech Stack" required="required"/>	
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
    )}
}

export default Projects