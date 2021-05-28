import React, { Component } from "react";
import Firebase from "firebase";
import "../signup.css";
import Redirect from "react-router-dom/Redirect";
import Route from "react-router-dom/Route";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      error: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.registerUser = this.registerUser.bind(this);
  } // end constructor

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  registerUser(event) {
    event.preventDefault();
    let previousUsernames = Firebase.database().ref("users");

    previousUsernames.on("value", (snapshot) => {
      if (snapshot.hasChild(this.state.username))
        return alert("This username is already in use");
    });

    if (this.state.password === this.state.confirmPassword) {
      Firebase.auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          let usernameToAdd = {};
          let currentUser = Firebase.auth().currentUser.uid;
          usernameToAdd[currentUser] = this.state.username;
          console.log(usernameToAdd);
          Firebase.database()
            .ref(`users/${currentUser}/`)
            .update(usernameToAdd);
        })
        .catch((error) => {
          this.setState({ error: error });
        });
    } else return alert("Your password and password confirmation must match!");
  }

  render() {
    const { username, email, password, confirmPassword } = this.state;

    const handleInput = this.handleInputChange;
    return (
      <div className="page-content-register">
        {Firebase.auth().currentUser &&
          !Firebase.auth().currentUser["isAnonymous"] && (
            <>
              <Route>
                <Redirect to={{ pathname: "/" }} />
              </Route>
            </>
          )}
        <div
          className="form-v9-content"
          style={{
            backgroundImage: "url(/RegBoxBackground.jpg)"
          }}
        >
          <form className="form-detail" onSubmit={this.registerUser}>
            <h2 id="regHead">Sign Up</h2>
            <div className="form-row-total">
              <div className="form-row">
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="input-text"
                  placeholder="Username"
                  value={username}
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="input-text"
                  placeholder="Email"
                  value={email}
                  onChange={handleInput}
                  required
                />
                {/* required pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}" */}
              </div>
            </div>
            <div className="form-row-total">
              <div className="form-row">
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="input-text"
                  placeholder="Password"
                  value={password}
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="input-text"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleInput}
                  required
                />
              </div>
            </div>
            <div className="form-row-last">
              <input
                type="submit"
                name="register"
                className="register"
                value="Register"
              />
            </div>
          </form>
        </div>
      </div>
    ); // end of return statement
  } // end of render function
} // end of class

export default Signup;
