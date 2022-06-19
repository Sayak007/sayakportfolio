import React, { Component } from 'react';
import db,{firebaseApp} from "../firebase.js";
import '../Css/Skills.css';
import _ from 'lodash';

class Skills extends Component{
    constructor() {
        super();
        this.state = ({
          user: null,
          details:[],
          image:"",
          designation:"",
          about:"",
          skill_content:{},
          bg_color:['#ADC8FE','#CCADFE','#ADFEE8','#C9FEAD','#FEC8AD', '#FEADC1' , '#92c736'],
        });
        this.skill_loader = this.skill_loader.bind(this);
    }
    componentDidMount() {
        this.skill_loader();
        //console.log(this.state.skill_content)
    }

    skill_loader(){
        let temp;
        db.collection("skills").onSnapshot((snapshot) =>
          this.setState({skill_content: _.mapValues(_.groupBy(snapshot.docs.map((doc) => doc.data()), s => s.skill_type))})
        );
        // var res = temp.reduce((r, a) => {
        //     r[a.skill_type] = r[a.skill_type] || [];
        //     r[a.skill_type].push(a);
        //     return r;
        // }, Object.create(null));
        // this.setState({skill_content: res});
    }
    render(){return (
        <div className="Skills" style={{marginTop: '80px'}}>
            <section className="gray-bg">
                <div className="container" style={{}}>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="section-title">
                                <h2>Skills</h2>
                            </div>
                        </div>
                    </div>
                    <div>
                    {Object.keys(this.state.skill_content).map((key)=> (
                        <div className='row mb-5' key={key}>
                            <h4 className='mb-4'><b>&#10687; {key}</b></h4>
                            <br/>
                            {this.state.skill_content[key].map(skill=>
                            (<div className='col-md-4 mb-4' key={skill.skill_name}>
                                <div className="col-md-11 base-card meter skill-card">
                                    <div className="progress pgout" style={{height: '100%'}}>
                                        
                                        <div className="progress-bar pg" style={{width: `${parseInt(skill.skill_level)}%`, height: '100%',background:this.state.bg_color[Math.floor(Math.random()*7)]}}></div>
                                    </div>
                                    <div className='d-flex' style={{zIndex:"1000",position:'absolute',top:"0",left:"2", margin:'25px'}}>
                                        <img className='skillimage' src = {skill.skill_image} />
                                        <h6 style={{margin: "auto auto auto 20px",wordWrap:'break-word',color: 'black', overflow:"hidden"}}><b>{skill.skill_name}</b></h6>
                                    </div>
                                </div>
                                
                            </div>))}
                        </div>
                    ))
                    }</div>
                    

                </div>
            </section>
        </div>
  
    )}
}

export default Skills