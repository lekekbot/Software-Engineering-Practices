// The code here was copied from https://github.com/LukasMarx/react-file-upload
// Online tutorial at : https://malcoded.com/posts/react-file-upload/
import React, { Component } from 'react';
import Header from '../../Elements/Header';
import Title from "../Title/Title";
import Dropzone from '../../Elements/Dropzone/Dropzone';
import styles from './UploadFile.module.css';
// The path is case sensitive: e.g. ../../Elements/progress/Progress won't work.
import Progress from '../../Elements/Progress/Progress';
// Need the following to obtain the server-side base URL
import config from '../../config.js';
import { getTokenFromLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
import { Container, Row , Col } from 'react-bootstrap';

class UploadFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false
    };
    
    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.token =  getTokenFromLocalStore();
    console.log(this.props)
    this.teamId = this.props.teamdata.params.userId
  }

  onFilesAdded(files) {
    this.setState(prevState => ({
      files: prevState.files.concat(files)
    }));
  }

  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    this.state.files.forEach(file => {
      promises.push(this.sendRequest(file));
    });
    try {
      await Promise.all(promises);

      this.setState({ successfullUploaded: true, uploading: false });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }



  sendRequest(file) {
    console.dir(file);
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = {
            state: 'pending',
            percentage: (event.loaded / event.total) * 100
          };
          this.setState({ uploadProgress: copy });
        }
      });

      req.upload.addEventListener('load', event => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: 'done', percentage: 100 };
        this.setState({ uploadProgress: copy });
        //The discussion here gives some insight how the 'load' works.
        //https://stackoverflow.com/questions/22140614/xmlhttprequest-send-not-working-in-chrome-and-opera
        console.dir('The req.send should have executed by now.');
        resolve(req.response);
      },false);

      req.upload.addEventListener('error', event => {
        const copy = { ...this.state.uploadProgress };
        console.log('Upload has error');
        console.log(req.response);
        copy[file.name] = { state: 'error', percentage: 0 };
        this.setState({ uploadProgress: copy });
        reject(req.response);
      });
      console.dir('The upload client-side logic is running now.');
      console.log( `${config.baseUrl}/u/teams/${this.teamId}/proposals/`);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('originalFileName',file.name);
      formData.append('token',this.token);
      //https://gist.github.com/Tamal/9231005f0c62e1a3f23f60dc2f46ae35
      req.open('POST', `${config.baseUrl}/u/teams/${this.teamId}/proposals/`);
      req.send(formData);
    });
  }

  renderProgress(file) {
    const uploadProgress = this.state.uploadProgress[file.name];
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="./../baseline-check_circle_outline-24px.svg"
            style={{
              opacity:
                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  }

  renderActions() {
    if (this.state.successfullUploaded) {
      return (
        <span className="float-right" > 
        <a variant="btn btn-default" href={`/teamsubmission/${this.teamId}`} >Cancel</a>
        <button
          onClick={() =>
            this.setState({ files: [], successfullUploaded: false })
          }
        >
          Clear
        </button>
        </span>
      );
    } else {
      return (
        <span className="float-right" > 
        <a variant="btn btn-default" href={`/teamsubmission/${this.teamId}`} >Cancel</a>
        <button className={`${styles.ActionButton}`}
          disabled={this.state.files.length < 0 || this.state.uploading}
          onClick={this.uploadFiles}
        >
          Upload proposal
        </button>
        </span>
      );
    }
  }

  render() {
    return (
      <Container className="fluid" style={{border:'solid 1px black'}}> 
      <Title title="Dashboard"></Title>
        
        <Row>
          <Col md={{ size: 9, offset: -1}}  
          lg={{ size: 9, offset: -1}}
           style={{border:'solid 1px black'}} className={`${styles.Card}`} >
      

      <div className={`${styles.Upload}`}>
        <span className={`${styles.Title}`}>Upload your proposal</span>
        <div className={`${styles.Content}`}>
          <div>
            <Dropzone
              onFilesAdded={this.onFilesAdded}
              disabled={this.state.uploading || this.state.successfullUploaded}
            />
          </div>
          <div className={`${styles.Files}`}>
            {this.state.files.map(file => {
              return (
                <div key={file.name} className={`${styles.Row}`}>
                  <span className={`${styles.Filename}`}>{file.name}</span>
                  {this.renderProgress(file)}
                </div>
              );
            })}
          </div>
        </div>
        <div className={`${styles.Actions}`}>{this.renderActions()}</div>
      </div>
      </Col>
      </Row>
      </Container>
    );
  }
}

export default UploadFile;
