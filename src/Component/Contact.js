import React, { Component } from 'react'
import '../Css/Contact.css'
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CallIcon from '@material-ui/icons/Call';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import db,{firebaseApp} from "../firebase.js";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

class Contact extends Component{
    constructor() {
        super();
        this.state = {
            user: null,
            fields: {name:"",email:"",subject:"",message:""},
            errors: {},
            details:[],
            columns:[
                {dataField: "name",text: "Name"},{dataField: "email",text: "Email ID"},
                {dataField: "subject",text: "Subject"},{dataField: "message",text: "Message"},
                {dataField: "timestamp",text: "TimeStamp",sort:true}
            ]
        };
        this.authListener = this.authListener.bind(this);
    }
    componentDidMount() {
        this.authListener();
        db.collection("contact").onSnapshot((snapshot) =>
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
    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
    
        //Name
        if (!fields["name"]) {
          formIsValid = false;
          errors["name"] = "Cannot be empty";
        }
    
        if (typeof fields["name"] !== "undefined") {
          if (!fields["name"].match(/^[a-zA-Z ]+$/)) {
            formIsValid = false;
            errors["name"] = "Only letters";
          }
        }
    
        //Email
        if (!fields["email"]) {
          formIsValid = false;
          errors["email"] = "Cannot be empty";
        }
    
        if (typeof fields["email"] !== "undefined") {
          let lastAtPos = fields["email"].lastIndexOf("@");
          let lastDotPos = fields["email"].lastIndexOf(".");
    
          if (
            !(
              lastAtPos < lastDotPos &&
              lastAtPos > 0 &&
              fields["email"].indexOf("@@") == -1 &&
              lastDotPos > 2 &&
              fields["email"].length - lastDotPos > 2
            )
          ) {
            formIsValid = false;
            errors["email"] = "Email is not valid";
          }
        }
        if (!fields["subject"]) {
            formIsValid = false;
            errors["subject"] = "Cannot be empty";
        }
        if (!fields["message"]) {
            formIsValid = false;
            errors["message"] = "Cannot be empty";
        }
    
        this.setState({ errors: errors });
        return formIsValid;
    }

    contactSubmit(e) {
        e.preventDefault();
    
        if (this.handleValidation()) {
          //alert("Form submitted");
          const contact = db.collection('contact');
          let fields = this.state.fields;
          contact.add({
              name: fields.name, email: fields.email, subject: fields.subject, message: fields.message, timestamp:new Date().toString()
            })
            this.setState({ success: true,  fields: {name:"",email:"",subject:"",message:""}});
        } else {
          //alert("Form has errors.");
        }
    }
    
    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    render(){ return (
        <div className='contact' style={{marginTop: '80px'}}>
            <div className="container-fluid" style={{marginTop:"30px"}}>
                <div className="crd mx-auto ">
                    <h3><b>Want to Connect? Send a Message Here</b></h3>
                    <br/>
                    <div className="row base-card justify-content-md-center ">
                        <div className='col-md-3 my-auto'>
                            <div className='bg-primary text-light br p-2'>
                            <br/>
                                <div className='d-flex flex-row'>
                                    <div>
                                        <LocationOnIcon className='text-warning'/>
                                    </div>
                                    <div style={{marginLeft:"7px"}}>
                                        <h6>Hooghly, West Bengal, India</h6>
                                    </div>
                                </div>
                                <br/>
                                <div className='d-flex flex-row'>
                                    <div>
                                        <CallIcon className='text-warning'/>
                                    </div>
                                    <div style={{marginLeft:"7px"}}>
                                        <h6>+91-9123894282</h6>
                                    </div>
                                </div>
                                <br/>
                                <div className='d-flex flex-row'>
                                    <div>
                                        <EmailOutlinedIcon className='text-warning'/>
                                    </div>
                                    <div style={{marginLeft:"7px"}}>
                                        <h6>dsksayak10@outlook.com</h6>
                                    </div>
                                </div>
                                <br/>
                            </div>
                        </div>
                        <div className='col-md-9 mt-3'>
                            <h3>Contact Form</h3>
                            <form name="contactForm" onSubmit={this.contactSubmit.bind(this)}>
                                <input ref="name" className='form-control br' name="name" placeholder='Name' onChange={this.handleChange.bind(this, "name")} value={this.state.fields.name}/>
                                <span style={{ color: "red" }}>{this.state.errors["name"]}</span>
                                <br/>
                                <input ref="email" className='form-control br' name="email" placeholder='Email Id' onChange={this.handleChange.bind(this, "email")} value={this.state.fields.email}/>
                                <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
                                <br/>
                                <input ref="subject" className='form-control br' name="subject" placeholder='Subject' onChange={this.handleChange.bind(this, "subject")} value={this.state.fields.subject}/>
                                <span style={{ color: "red" }}>{this.state.errors["subject"]}</span>
                                <br/>
                                <textarea ref="message" className='form-control br' name="message" placeholder='Message' rows="4" onChange={this.handleChange.bind(this, "message")} value={this.state.fields.message}/>
                                <span style={{ color: "red" }}>{this.state.errors["message"]}</span>
                                <br/>
                                {this.state.success==true? (<p className='text-success'>Message sent successfully</p>): ("")}
                                <div className="form-group">
                                    <button id="submit" value="Submit"  className="btn btn-primary btn-lg btn-block login-btn br w-50 mx-auto" data-dismiss="modal">Send</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {this.state.user?(
                    <div className="crd mx-auto mt-5">
                        <div className='row base-card div-horizontal' style={{overflowX:"scroll"}}>
                            <BootstrapTable
                                bootstrap5
                                keyField="timestamp"
                                data={this.state.details}
                                columns={this.state.columns}
                                pagination={paginationFactory({ sizePerPage: 5 })}
                                wrapperClasses="table-responsive"
                                striped
                                hover
                                condensed
                            />
                        </div>
                    </div>
                ):("")}
            </div>
        </div>
    )};
}

export default Contact

