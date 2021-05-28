import { React, Component } from "react";
import Firebase from "firebase";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import Signup from "./Signup";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import About from "./About";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import "../styles.css";
import MyDiary from "./MyDiary";
import NavBar from "./NavBar";
import SearchResults from "./SearchResults";
import Dashboard from "./Dashboard";
//import Navigation from "./navigation";
// import AuthContexts from "./contexts/AuthContexts";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      currentUser: null
    };
  }

  async componentDidMount() {
    await Firebase.auth().onAuthStateChanged((user) => {
      user
        ? this.setState(() => ({ authenticated: true, currentUser: user }))
        : this.setState(() => ({
            authenticated: false,
            user: null
          }));

      this.forceUpdate();
    });
  }

  render() {
    return (
      <div>
        {<NavBar />}
        <br />
        <Container style={{ width: "100vw" }}>
          <Router>
            <AuthProvider>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <Route path="/about" component={About} />
                <Route path="/diary" component={MyDiary} />
                <Route path="/search" component={SearchResults} />
                <Route path="/dashboard" component={Dashboard} />
              </Switch>
            </AuthProvider>
          </Router>
        </Container>
      </div>
    );
  }
}
export default App;
