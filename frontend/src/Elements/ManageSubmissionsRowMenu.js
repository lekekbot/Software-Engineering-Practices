import React from 'react';
import { Dropdown } from 'react-bootstrap';

class ManageSubmissionsRowMenu extends React.Component {
  constructor(props) {
    super(props);
    //Took a long time to appreciate how to pass props into a class component
    //so that my code can generate "/dynamic links/<team id>"
    //https://codesandbox.io/s/j2wnvr181w?file=/src/index.js:2627-2720
    //https://github.com/react-bootstrap-table/react-bootstrap-table2/issues/817
    //
    this.editorProps = this.props.editorProps;
    console.log('Inspect the props');
    console.log(props);
  }
    canCelClickEvent=(e)=>{
        e.stopPropagation();
    }

    render() {
      console.log()
      return (
        
        <Dropdown key={`dropdown_${this.props.row.fileId}`}>
        <Dropdown.Toggle 
        variant="primary btn-sm" 
        id="dropdown-basic">
            Manage submission
        </Dropdown.Toggle>

        <Dropdown.Menu style={{backgroundColor:'#73a47'}}  key={this.props.row.fileId}>
 
        <Dropdown.Item  key={`option_1_${this.props.row.fileId}`}  download={this.props.row.fileName} href={this.props.row.url} >Download</Dropdown.Item>      
        <Dropdown.Item  key={`option_2_${this.props.row.fileId}`}  href="#" 
                  onClick={(event) => this.props.handleRemoveSubmissionAction(event,this.props.row.fileId,this.props.row.cloudinaryFileId)} >Remove</Dropdown.Item>
          
        </Dropdown.Menu>
        </Dropdown>
        
      );
        
    }
  }
  export default ManageSubmissionsRowMenu;
  
 