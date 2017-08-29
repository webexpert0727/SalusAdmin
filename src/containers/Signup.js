import React, { Component } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import firebase from '../config/database'
import Config from   '../config/app';
import { browserHistory } from 'react-router';
import Plans from '../components/Plans/Plans';
import Card from '../components/Card/Card';

class Signup extends Component {

  constructor(props) {

    super(props);
    this.state = {
      username: '',
      password: '',
      companyName: '',
      phoneNumber: '',
      error:'',
      plan: '',
      name: '',
    };

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeCompany = this.handleChangeCompany.bind(this);
    this.handleChangePhone = this.handleChangePhone.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.authenticate = this.authenticate.bind(this);
  }



  handleChangeUsername(event) {
    this.setState({username: event.target.value});
  }

  handleChangePassword(event) {
    this.setState({password: event.target.value});
  }

    handleChangeCompany(event) {
    this.setState({companyName: event.target.value});
  }

  handleChangePhone(event) {
    this.setState({phoneNumber: event.target.value});
  }

  handleSubmit(event) {
    //alert('Username: ' + this.state.username+ " Password: "+this.state.password);
    this.authenticate(this.state.username, this.state.password, this.state.companyName, this.state.phoneNumber);
    event.preventDefault();
  }
  createCard(cust_id) {
      fetch('https://api.stripe.com/v1/customers/'+cust_id+'/sources', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization' : 'Bearer sk_test_7JptRhoLDP2UzOEaPnaDUmQi'
        },
        body: 'source[object]=card&source[number]=4242424242424242&source[exp_month]=12&source[exp_year]=2018'
      }).then((response) => response.json())
        .then((responseJson) => {
                this.createSubscriptions(cust_id);
              console.log(responseJson);
        })
        .catch((error) => {
          console.error(error);
        });
  }
  createSubscriptions(cust_id) {
      fetch('https://api.stripe.com/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization' : 'Bearer sk_test_7JptRhoLDP2UzOEaPnaDUmQi'
        },
        body: 'customer='+cust_id+'&plan=1'
      }).then((response) => response.json())
        .then((responseJson) => {
              console.log(responseJson);
        })
        .catch((error) => {
          console.error(error);
        });
  }
  authenticate(username, password, companyName, phoneNumber) {
    const displayError = (error) => {
      this.setState({error: error});
    };
        fetch('https://api.stripe.com/v1/customers', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization' : 'Bearer sk_test_7JptRhoLDP2UzOEaPnaDUmQi'
          },
          body: 'email=arsl@gmail.com&description=arslan'
        }).then((response) => response.json())
          .then((responseJson) => {
                this.createCard(responseJson.id);
                console.log(responseJson);
          })
          .catch((error) => {
            console.error(error);
          });


    //
    // var customer = stripe.customers.create({
    //   email: "jenny.rosen@example.com",
    // }, function(err, customer) {
    //   // asynchronously called
    // });

    // window.stripe.createToken(this.card.card)
    //   .then(({error, token}) => {
    //     if (error) {
    //       console.log(error.message);
    //     } else {
    //
    //       if (Config.adminConfig.allowedUsers !== null && Config.adminConfig.allowedUsers.indexOf(username) === -1) {
    //         //Error, this user is not allowed anyway
    //         displayError("This user doens't have access to this admin panel!");
    //       } else {

            firebase.auth().createUserWithEmailAndPassword(username, password)
              .then(
                function (data) {
                  console.log("Yes, user is logged in");

                  var vendor = {
                    company: companyName,
                    phone: phoneNumber,
                    uid: data.uid,
                  };

                  firebase.database().ref().child('users').child(data.uid).update(vendor);

                  browserHistory.push('/');
                }
              )
              .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(error.message);
                displayError(error.message);

              });
          // }
      //   }
      //
      // });
  }

  render() {


    return (
      <div className="content" style={{ paddingTop: '14vh' }}>
        <div className="container">
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1 col-md-6 col-md-offset-3">
              <form onSubmit={this.handleSubmit}>
                <div className="card card-login card-hidden">
                  <div className="card-header text-center" style={{ marginLeft: '125px', marginRight: '125px' }} data-background-color="rose">
                    <h4 className="card-title">Signup</h4>

                  </div>

                  <div className="card-content">
                    <h4>{this.state.error}</h4>
                      <Row>
                        <Col md={ 6 }>
                          <div className="input-group">
                                              <span className="input-group-addon">
                                                  <i className="material-icons">business</i>
                                              </span>
                            <div className="form-group label-floating">
                              <label className="control-label">Company Name</label>
                                <input type="text" value={this.state.companyName} onChange={this.handleChangeCompany} className="form-control" />
                            </div>
                          </div>
                        </Col>
                        <Col md={ 6 }>
                          <div className="input-group">
                                              <span className="input-group-addon">
                                                  <i className="material-icons">phone</i>
                                              </span>
                            <div className="form-group label-floating">
                              <label className="control-label">Phone Number</label>
                              <input type="text" value={this.state.phoneNumber} onChange={this.handleChangePhone} className="form-control" />
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={ 6 }>
                          <div className="input-group">
                                              <span className="input-group-addon">
                                                  <i className="material-icons">email</i>
                                              </span>
                            <div className="form-group label-floating">
                              <label className="control-label">Email address</label>
                              <input type="email" value={this.state.username} onChange={this.handleChangeUsername} className="form-control" />
                            </div>
                          </div>
                        </Col>
                        <Col md={ 6 }>
                          <div className="input-group">
                                              <span className="input-group-addon">
                                                  <i className="material-icons">lock_outline</i>
                                              </span>
                            <div className="form-group label-floating">
                              <label className="control-label">Password</label>
                              <input type="password" value={this.state.password} onChange={this.handleChangePassword} className="form-control" />
                            </div>
                          </div>
                        </Col>
                      </Row>
                  </div>
                  <Row style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <Col xs={10} xsOffset={1}>
                      <Alert style={{ backgroundColor: "#3CC996" }}>
                        <strong>Select your plan.</strong>. Your subscription will begin immediately and be renewed based off of the selected plan. Cancel anytime.
                      </Alert>
                      <Plans />
                      <div className="CardForm">
                        <label className="Label SecureStripe"><i className="fa fa-lock" /> Payments securely processed by Stripe</label>
                        <Card style={{ height: '35px' }} ref={card => (this.card = card)} />
                      </div>
                    </Col>
                  </Row>
                  <div className="footer text-center">
                    <input type="submit" className="btn btn-fill btn-rose" style={{ width: '275px' }} value={this.state.login} />

                  </div>
                  <div className="text-center" style={{ marginTop: "10px" }}>

                    <label>Already have an account?</label> <a href="/login">Login Here.</a>

                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Signup;
