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
import Tesseract from 'tesseract.js';
import imag from './unnamed.jpg';
import Webcam from 'react-webcam';
import QuickEncrypt from 'quick-encrypt';
import firebase from 'firebase';

// import QrReader from 'react-qr-scanner';
import './styles.css';

firebase.initializeApp({
  apiKey: 'AIzaSyDmPjbRFqvwZqgc_STGMwz_N3dQMzB9IPc',
  authDomain: 'app-authentication-gg.firebaseapp.com',
  databaseURL: 'https://app-authentication-gg.firebaseio.com',
  projectId: 'app-authentication-gg',
  storageBucket: 'app-authentication-gg.appspot.com',
  messagingSenderId: '851528300911',
  appId: '1:851528300911:web:1ced44b39024ffe9a0509a',
  measurementId: 'G-1EJY8DF5WR',
});

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: 'No result',
      decoded: '',
      message: '',
      time: '',
      licenseScan: '',
      user: '',
      videoConstraints: {
        width: 1280,
        height: 1280,
        // facingMode: { exact: 'environment' },
        facingMode: "user",
      },
    };
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  handleScan = async data => {
    if (data) {
      this.setState({data:data});
      var d = new Date();
      this.setState({
        time:
          d.getHours() +
          ':' +
          d.getMinutes() +
          ':' +
          d.getSeconds() +
          ' - ' +
          d.getDate() +
          '/' +
          (d.getMonth() + 1) +
          '/' +
          d.getFullYear(),
      });
      try {
        JSON.parse(data)
      } catch (error) {
        this.setState({user:null, message:"Invalid QR"});
        return;
      }
      this.setState({
        result: JSON.parse(data),
        // decoded: jwt.decode(this.state.result),
      });
      var privateKey = '';
      var name = '';
      var brand = '';
      var licenseNo = '';
      var con = await firebase
        .database()
        .ref('/users/' + this.state.result.uid)
        .once('value')
        .then(function(snapshot) {
          privateKey =
            (snapshot.val() && snapshot.val().privateKey) || 'Anonymous';
          console.log(privateKey);

          name = (snapshot.val() && snapshot.val().displayName) || 'Anonymous';
          brand = (snapshot.val() && snapshot.val().brand) || 'Anonymous';
          licenseNo =
            (snapshot.val() && snapshot.val().licenseNo) || 'Anonymous';
        });
      this.setState({
        user: {
          name,
          brand,
          licenseNo,
        },
      });
      let decryptedText = QuickEncrypt.decrypt(
        this.state.result.encrypt,
        privateKey,
      );


      try {
        JSON.parse(decryptedText)
      } catch (error) {
        this.setState({user:null, message:"Invalid QR"});
        return;
      }
      const decryptStr = JSON.parse(decryptedText);

      console.log(decryptStr);
      console.log(decryptStr.licenseNo, this.state.user.licenseNo);
      if (decryptStr != null) {
        const iat = Math.floor(Date.now() / 1000) - 30;
        if (decryptStr.exp + 30 < iat) {
          console.log('expired');
          this.setState({ message: 'Token is expired', user: null });
        } else if (decryptStr.licenseNo != this.state.user.licenseNo) {
          this.setState({ message: 'Invalid', user: null });
        }
      } else {
        this.setState({ message: 'Invalid token' });
      }
    }
  };
  // handleScan = data => {
  //   if (data) {
  //     this.setState({
  //       result: data,
  //       decoded: jwt.decode(this.state.result),
  //     });
  //     if (this.state.decoded != null) {
  //       const iat = Math.floor(Date.now() / 1000) - 30;
  //       if (this.state.decoded.exp + 30 < iat) {
  //         console.log('expired');
  //         this.setState({ message: 'Token is expired', decoded: null });
  //       }
  //     } else {
  //       this.setState({ message: 'Invalid token' });
  //     }
  //   }
  // };
  handleError = err => {
    console.error(err);
  };

  capture = async () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({ imgSrc: imageSrc });
  console.log(imageSrc);
    const imageStr = imageSrc.slice(22);
    let body = JSON.stringify({
      requests: [
        {
          image: {
            content: imageStr,
          },
          features: [
            { type: 'TEXT_DETECTION', maxResults: '50' },
            { type: 'OBJECT_LOCALIZATION', maxResults: '50' },
          ],
        },
      ],
    });
    let response = await fetch(
      'https://vision.googleapis.com/v1/images:annotate?key=' +
        'AIzaSyBPWFQyVQrljS9VuKuKceA3RGWRy_frK1o',
      {
        method: 'post',
        body: body,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(data => {
        const responses = data.responses;
        console.log(responses);
        if (responses) {
          const licenseText = responses[0].fullTextAnnotation.text;
          if (licenseText) {
            this.setState({
              licenseScan: licenseText.replace('\n', ' '),
            });
          } else {
            console.log('Not Found');
          }
        } else {
          console.log('Not Found');
        }
      });
  };

  render() {
    // const decoded = jwt.decode(this.state.result);
    const { user, time, licenseScan } = this.state;
    // console.log(this.state.result);
    //
    // console.log(decoded);
    return (
      <div className="qr">
        <div className="qr-section">
          <QrReader
            delay={100}
            onError={this.handleError}
            onScan={this.handleScan}
          />
        </div>
        <Webcam
          audio={false}
          height={1}
          ref={this.setRef}
          screenshotFormat="image/png"
          width={350}
          videoConstraints={this.state.videoConstraints}
          style={{ visibility: 'hidden' }}
        />
        <img src={this.state.imgSrc} />
        <button onClick={this.capture}>Capture photo v2</button>
        {licenseScan != '' ? (
          <p>
            Scan License No:{licenseScan}.{' '}
            {user && licenseScan.trim() === user.licenseNo.trim()
              ? "It's match"
              : "It's not match"}{' '}
          </p>
        ) : (
          ''
        )}

        {/* <QrScanner
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          // style={{ width: "100%"}}
        /> */}
        {/* <p>Scan QR Code</p> */}
        {/* <p>{this.state.result}</p> */}
        {user == null ? <p>{this.state.message}</p> : ''}
        {user ? (
          <div className="sub-container">
            <p>Hi {user.name}</p>
            <p>Brand: {user.brand}</p>
            <p>Time: {time}</p>
            <p
              style={
                licenseScan
                  ? licenseScan.trim() === user.licenseNo.trim()
                    ? { color: 'green' }
                    : { color: 'red' }
                  : {}
              }
            >
              License No: {user.licenseNo}
            </p>

          </div>
        ) : (
          ''
        )}
        <p>{this.state.data}</p>
        {/* {user != null ? JSON.stringify(decoded) : ''} */}
      </div>
    );
  }
}
export default HomePage;
