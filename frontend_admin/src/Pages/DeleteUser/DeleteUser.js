import React, { useEffect } from "react";

import axios from 'axios';


import Header from '../../Elements/Header/Header';
import Title from "../../Elements/Title/Title";
import "./DeleteUser.css";
import config from '../../Config.js';

//functions can't handle state well, so i changed to class
export default class kek extends React.Component {
    constructor() {
        super()
        this.state = {
            searchData: [],
            userData: [],
            master: '',
            prevData: '',
            deleteUser: [],
            deletemsg: '',
            pendingdeletedata: [],
            disabledelete: true,
            confirm: false
        }
        this.handleSearch.bind(this)
        this.handleRowClick.bind(this)
        this.handleAdmin.bind(this)
    }

    async componentDidMount (){
        //get table 

        //check if master admin or admin
        var email = localStorage.getItem('email')
        await axios.get(`${config.baseUrl}/a/admin/adminid/${email}`)
        .then((response) => {
          if(response.data[0].role_name === 'master_admin') {
            this.setState({master: true})
          } else {
            this.setState({master: false})
          }
        })
        .catch(err => {
            console.log(err)
            this.setState({master: false})
          })

        //get user table

        axios.get(`${config.baseUrl}/a/userList/${this.state.master}`)
        .then(response => {
            let data = response.data.map(e => 
                <div key={e.user_id} id={e.user_id} className='rows'
                onClick={e => this.handleRowClick(e)}>
                    <div>{e.first_name}</div>
                    <div>{e.last_name}</div>
                    <div>{e.role_name}</div>
                </div>)
                this.setState({userData: data})
        })
        .catch(err => console.log(err))
    }

    //get data if user is master admin/admin 

    handleRowClick = (e) => {
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

    // handle search when user types something
    handleSearch = (e) => {
            let val = e.currentTarget.value
            if(val != '') {
                let html = this.state.userData.map((e)=> {
                    return (e.props.children[0].props.children.toLowerCase().includes(val.toLowerCase()) || e.props.children[1].props.children.toLowerCase().includes(val.toLowerCase()) ?
                        <div key={e.key} id={e.key} className='rows'
                        onClick={evt => this.handleRowClick(evt)}>
                            <div>{e.props.children[0].props.children}</div>
                            <div>{e.props.children[1].props.children}</div>
                            <div>{e.props.children[2].props.children}</div>
                        </div> : '')
                })
                html = html.filter(el => el)
    
                if(html.length > 0) { 
                   return this.setState({searchData: html})
                } else {
                return this.setState({searchData: [<div key="nothing" className='rows'>nothing mate, try harder</div>]})
                }
            } else {
                return this.setState({searchData: this.state.userData})
            }
        }

    //it is what it is, deletes user stuff
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
                        onClick={e => this.handleRowClick(e)}>
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
                <Header/>
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