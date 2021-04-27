import React from 'react';
import { Dropdown } from 'react-bootstrap';

class ManageTeamMemberRowMenu extends React.Component {
  constructor(props) {
    super(props);
    //Took a long time to appreciate how to pass props into a class component
    //so that my code can generate "/dynamic links/<team id>"
    //https://codesandbox.io/s/j2wnvr181w?file=/src/index.js:2627-2720
    //https://github.com/react-bootstrap-table/react-bootstrap-table2/issues/817
    //
    this.editorProps = this.props.editorProps;
    console.log(this.props.row.id);
  }
    canCelClickEvent=(e)=>{
        e.stopPropagation();
    }

    render() {
      console.log()
      return (
        
        <Dropdown>
        <Dropdown.Toggle 
        variant="primary btn-sm" 
        id="dropdown-basic">
            Manage team
        </Dropdown.Toggle>

        <Dropdown.Menu style={{backgroundColor:'#73a47'}}>
            {(this.props.row.type=='Team leader') && 
              (<Dropdown.Item href="#" 
               onClick={(event)=>this.canCelClickEvent}>Not applicable</Dropdown.Item>)
            }
            {!(this.props.row.type=='Team leader') && 
                  <Dropdown.Item  href="#" 
                  onClick={(event) => this.props.handleRemoveTeamMemberAction(event,this.props.row.teamId,this.props.row.teamMemberId)} >Remove member</Dropdown.Item>
            }
        </Dropdown.Menu>
        </Dropdown>
        
      );
        
    }
  }
  export default ManageTeamMemberRowMenu;
  
 