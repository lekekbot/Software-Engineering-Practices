import React, { useEffect } from "react";

import axios from 'axios';


import Header from '../../Elements/Header/Header';
import Title from "../../Elements/Title/Title";
import "./DeleteUser.css";
import config from '../../Config.js';

//functions can't handle state well, so i changed to clas
export default class kek extends React.Component {
    constructor() {
        super()
        this.state = {
            searchData: [],
            userData: [],
            master: false,
            prevData: '',
            deleteUser: [],
            deletemsg: '',
            pendingdeletedata: [],
            disabledelete: true,
            confirm: false
        }
        this.handleSearch.bind(this)
        this.gay.bind(this)
    }
    componentDidMount(){
        axios.get(`${config.baseUrl}/a/userList`, {master: this.state.master})
        .then(response => {
            let data = response.data.map(e => 
                <div key={e.user_id} id={e.user_id} className='rows'
                onClick={e => this.gay(e)}>
                    <div>{e.first_name}</div>
                    <div>{e.last_name}</div>
                    <div>{e.role_name}</div>
                </div>)
                this.setState({userData: data})
        })
        .catch(err => console.log(err))
    }

    handleAdmin = (data) => {
        this.setState({master: data})
    }

    gay = (e) => {
        this.setState({prevData: e.currentTarget})
        if(this.state.prevData) this.state.prevData.style.backgroundColor = 'transparent'
        e.currentTarget.style.backgroundColor = 'orange'  
        let id = e.currentTarget.id  
        // axios part to show stuff
        axios.get(`${config.baseUrl}/a/delete/pending/${id}`)
        .then(response => {
            let data = response.data
            if(data[0].name == undefined) {
                this.setState({deletemsg: `You are deleting ${data[0].first_name} ${data[0].last_name}: `, deleteUser: [<div>No Team involved</div>], disabledelete: false, confirm:false, pendingdeletedata:data})    
            } else {
                let i = 0
                let output = data.map(e => {
                    return <div key={i++}>
                        {e.leader == 1 ? 
                        <div>You will be deleting <strong>{e.name}</strong> from the database</div>  : 
                        <div>You will be deleting <strong>{e.first_name}</strong> from the team: <strong>{e.name}</strong></div>}
                    </div>
                })
                this.setState({deletemsg: `You are deleting ${data[0].first_name} ${data[0].last_name}: `, deleteUser: output, disabledelete: false, confirm:false, pendingdeletedata:data})    
            }
        })
        .catch(err => console.log(err))
    }

    handleSearch = (e) => {
            let val = e.currentTarget.value
            if(val != '') {
                let cheese = this.state.userData.map((e)=> {
                    return (e.props.children[0].props.children.toLowerCase().includes(val.toLowerCase()) || e.props.children[1].props.children.toLowerCase().includes(val.toLowerCase()) ?
                        <div key={e.key} id={e.key} className='rows'
                        onClick={evt => this.gay(evt)}>
                            <div>{e.props.children[0].props.children}</div>
                            <div>{e.props.children[1].props.children}</div>
                            <div>{e.props.children[2].props.children}</div>
                        </div> : '')
                })
                cheese = cheese.filter(el => el)
    
                if(cheese.length > 0) { 
                   return this.setState({searchData: cheese})
                } else {
                return this.setState({searchData: [<div key="nothing" className='rows'>nothing mate, try harder</div>]})
                }
            } else {
                return this.setState({searchData: this.state.userData})
            }
        }

    handleDelete =() => {
        if(this.state.confirm) {
            //handle axios delete 
            axios.delete(`${config.baseUrl}/a/delete/${this.state.pendingdeletedata[0].user_id}`,{data: {data: this.state.pendingdeletedata}})
            .then(response => {
                console.log(response)
                alert('User successfully deleted')
                axios.get(`${config.baseUrl}/a/userList`, {master: this.state.master})
                .then(response => {
                    let data = response.data.map(e => 
                        <div key={e.user_id} id={e.user_id} className='rows'
                        onClick={e => this.gay(e)}>
                            <div>{e.first_name}</div>
                            <div>{e.last_name}</div>
                            <div>{e.role_name}</div>
                        </div>)
                        this.setState({userData: data})
                })
                .catch(err => console.log(err))

            })
            .catch(err => console.log(err))
        }else {
            this.setState({confirm:true})
        }
    }

    render(){
        return (
            <div>
                    <Title title={'Delete User'}/>
                <Header masteradmin={this.handleAdmin}/>
                <h1>Delete User</h1>
                <div className="searchBar">
                   <h6>Search:</h6> <input type="text" onChange={e => this.handleSearch(e)}/>
                </div>
                <div className='data-row'>
                    {this.state.searchData.length > 0 ? this.state.searchData : this.state.userData}
                </div>
                <div className='user-data-row'>
                    {this.state.deletemsg}
                    {this.state.deleteUser}
                    <button
                    disabled={this.state.disabledelete}
                    onClick={this.handleDelete}
                    >{this.state.confirm ? 'Are you Sure? This action is irreversible': 'Delete User'}</button>
                </div>
            </div>
        )
    }
}