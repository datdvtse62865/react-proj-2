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
import QrScanner from 'react-qr-scanner';
// import QrReader from 'react-qr-scanner';
import './styles.css';
class HomePage extends React.Component {
  state = {
    result: 'No result',
    decoded: '',
    message: '',
    time:'',
  };

  handleScan = data => {
    if (data) {
      this.setState({
        result: data,
        decoded: jwt.decode(this.state.result),
      });
      if (this.state.decoded != null) {
        const iat = Math.floor(Date.now() / 1000) - 30;
        console.log(this.state.decoded.exp,iat);
        var d= new Date();
        this.setState({time:d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+" - "+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()});
        if (this.state.decoded.exp+30 < iat) {
          console.log("expired");
          this.setState({ message: 'Token is expired', decoded: null });
        }
      } else {
        this.setState({ message: 'Invalid token' });
      }
    }
  };
  handleError = err => {
    console.error(err);
  };
  render() {
    // const decoded = jwt.decode(this.state.result);
    const {decoded,time} = this.state;
    // console.log(this.state.result);
//
    // console.log(decoded);
    return (
      <div className="qr">
        <QrReader
          delay={100}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '90%' }}
        />
        {/* <QrScanner
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "90%"}}
        /> */}
        <p>Scan QR Code</p>
        {/* <p>{this.state.result}</p> */}
        {decoded == null ? (
          <p>{this.state.message}</p>
        ) : (
          ''
        )}
        {decoded ? (
          <div className="sub-container">
            <p>Hi {decoded.displayName}</p>
            {/* <p>Email: {decoded.email}</p> */}
            <p>License No: {decoded.licenseNo}</p>
            <p>Brand: {decoded.brand}</p>
        <p>Time: {time}</p>
          </div>
        ) : (
          ''
        )}
        {decoded != null ? JSON.stringify(decoded) : ''}
      </div>
    );
  }
}
export default HomePage;
