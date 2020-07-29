/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import jwt, { decode } from 'jsonwebtoken';
import QrReader from 'react-qr-reader';
import './styles.css';
class HomePage extends React.Component {
  state = {
    result: 'No result',
  };

  handleScan = data => {
    if (data) {
      this.setState({
        result: data,
      });
    }
  };
  handleError = err => {
    console.error(err);
  };
  render() {
    const decoded = jwt.decode(this.state.result);
    console.log(this.state.result);
    console.log(decoded);
    return (
      <div className="qr">
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '90%' }}
        />
        {/* <p>{this.state.result}</p> */}
        {this.state.result!="No result"  && decoded == null ? (<p>I receive QR but it not token</p>): ""}
        {decoded != null ? (
          <div>
            <p>Name: {decoded.name}</p>
            <p>Email: {decoded.email}</p>
          </div>
        ) : (
          ''
        )}
        {decoded != null ? JSON.stringify(decoded) : ""}
      </div>
    );
  }
}
export default HomePage;
