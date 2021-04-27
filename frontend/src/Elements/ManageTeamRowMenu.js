import React from 'react';
import { Dropdown } from 'react-bootstrap';
class ManageTeamRowMenu extends React.Component {
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
    render() {
      console.log()
      return (
        
        <Dropdown>
        <Dropdown.Toggle 
        variant="primary btn-sm" 
        id="dropdown-basic">
            You can ...
        </Dropdown.Toggle>

        <Dropdown.Menu style={{backgroundColor:'#73a47'}}>
            {(this.props.row.memberType=='Team leader') && (<Dropdown.Item href={`/manageinvites/${this.props.row.id}`}>Invite team members</Dropdown.Item>)}
            {(this.props.row.memberType=='Team leader') && (<Dropdown.Item  href={`/manageteammembers/${this.props.row.id}`}>Manage team members</Dropdown.Item> )}          
            <Dropdown.Item  href={`/submitproposal/${this.props.row.id}`}>Submit proposal</Dropdown.Item>
            <Dropdown.Item  href={`/managesubmissions/${this.props.row.id}`}>Manage submissions</Dropdown.Item>

        </Dropdown.Menu>
        </Dropdown>
        
      );
        
    }
  }
  export default ManageTeamRowMenu;
  
 