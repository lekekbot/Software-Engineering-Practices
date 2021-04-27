import React, { Component } from 'react';
import styles from './Progress.module.css';

class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={`${styles.ProgessBar}`}>
        <div
          className={`${styles.Progress}`}
          style={{ width: this.props.progress + '%' }}
        />
      </div>
    );
  }
}

export default Progress;
