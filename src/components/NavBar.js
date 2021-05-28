import React, { Component } from "react";
import { Navbar, Form, Button, FormControl, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
import {
  Route,
  BrowserRouter as Router,
  NavLink,
  Switch
} from "react-router-dom";
import firebase from "firebase";
import Redirect from "react-router-dom/Redirect";
import home from "./Home";
import SignUp from "./Signup";
import SearchResults from "./SearchResults";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      searchSubmitted: false,
      userLocal: null
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLogout() {
    firebase.auth().signOut();
  }

  handleSubmit(search) {
    //console.log("hello");
    //console.log(this.state.searchSubmitted);
    this.setState({ searchSubmitted: true });
    //return <SearchResults />
    //return <Router>
    //    <Redirect to={"/search?searchTerm=" + this.state.searchTerm} />
    //    <Route path="/search" component={SearchResults} />
    //</Router>
    //<SearchResults searchTerm = {this.state.searchTerm}/>
  }

  render() {
    let userIsAnonymous = firebase.auth().currentUser;
    console.log(userIsAnonymous);
    return (
      <Router>
        <div className="NavBar">
          <Navbar bg="dark" variant="dark">
            {firebase.auth().currentUser &&
              !firebase.auth().currentUser["isAnonymous"] && (
                <Navbar.Brand href="/diary">My diary</Navbar.Brand>
              )}
            {(!firebase.auth().currentUser ||
              firebase.auth().currentUser["isAnonymous"]) && (
              <Navbar.Brand href="/">Homepage</Navbar.Brand>
            )}
            <Nav className="mr-auto">
              {firebase.auth().currentUser &&
                !firebase.auth().currentUser["isAnonymous"] && (
                  <>
                    <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                    <Nav.Link
                      onClick={() => {
                        this.handleLogout();
                      }}
                      href="/"
                    >
                      Logout
                    </Nav.Link>
                  </>
                )}
              {(!firebase.auth().currentUser ||
                firebase.auth().currentUser["isAnonymous"]) && (
                <>
                  <Nav.Link href="/">Home</Nav.Link>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/signup">Register</Nav.Link>
                </>
              )}
              <Nav.Link href="/about">About</Nav.Link>
            </Nav>
            <Form
              inline
              onSubmit={(e) => {
                e.preventDefault();
                this.handleSubmit();
              }}
            >
              <FormControl
                type="text"
                name="searchTerm"
                placeholder="Search"
                value={this.state.searchTerm}
                onChange={this.handleInputChange}
                className="mr-sm-2"
              />
              <Button type="submit" variant="outline-info">
                Search
              </Button>
            </Form>
          </Navbar>
          {this.state.searchSubmitted && (
            <>
              {this.setState({ searchSubmitted: false })}
              <Route>
                <Redirect
                  to={"/search?searchTerm=" + this.state.searchTerm}
                  state={this.state.searchTerm}
                />
              </Route>
            </>
          )}
        </div>
      </Router>
    );
  }
}

export default NavBar;
