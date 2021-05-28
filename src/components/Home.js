import React, { Component } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "../styles.css";
import firebase from "firebase";

class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: "",
      posts: []
    };
  }
  //created an imaginary user to serve as a placeholder user to "sign in" and be able to view dB contents
  //must be signed-in in some form to access content within dB
  //"testuser@gmail.com" - testingPass
  //makes the content render to the carousel

  async componentDidMount() {
    // as soon as the component mounts, get the most recent messages from the firebase database.
    //firebase
    //  .auth()
    //  .signInWithEmailAndPassword("testuser@gmail.com", "testingPass");
    if (!firebase.auth().currentUser) {
      await firebase
        .auth()
        .signInAnonymously()
        .then(async () => {
          console.log("here");
          await this.getMessagesFromDatabase();
          console.log("finished getting messages");
          //firebase.auth().signOut();
          //console.log("signed out");
        });
    } else await this.getMessagesFromDatabase();
  }

  async getMessagesFromDatabase() {
    let uid = "7suguaRAnKaWRAXpv7BDLkSuStS2";
    let ref = firebase.database().ref("posts").child(uid);

    ref.on("value", async (snapshot) => {
      // json array
      console.log(snapshot);
      let msgData = snapshot.val();
      let newMessagesFromDB = [];

      // create a JSON object version of our object.
      for (let m in msgData) {
        if (msgData[m]["visibility"] === "public") {
          let currObject = {
            timestamp: m,
            content: msgData[m]["content"],
            flags: JSON.stringify(msgData[m]["flags"])
          };
          newMessagesFromDB.push(currObject); // add it to our newStateMessages array.
        }
      } // end for loop
      // set state = don't use concat.

      this.setState({ posts: newMessagesFromDB });

      console.log(firebase.auth().currentUser);
    }); // end of the on method
  }

  render() {
    return (
      <div>
        <div className="App">
          <span className="headings">
            <h1 id="homeHeading">Online Diary</h1>
          </span>

          <div className="blackboard">
            <h2 id="homeId">Posts of the day</h2>
            <div className="carousel">
              <AliceCarousel autoPlay autoPlayInterval="3000">
                {this.state.posts.slice(0, 1).map((data, index) => (
                  <div key={index}>{data.content}</div>
                ))}

                {this.state.posts.slice(1, 2).map((data, index) => (
                  <div key={index}>{data.content}</div>
                ))}

                {this.state.posts.slice(2, 3).map((data, index) => (
                  <div key={index}>{data.content}</div>
                ))}

                {this.state.posts.slice(3, 4).map((data, index) => (
                  <div key={index}>{data.content}</div>
                ))}
              </AliceCarousel>
            </div>
          </div>

          {/* buttons */}
          {/* <div className="wrap">
         
          <button
            id="login"
            className="button"
            onClick={(event) => (window.location.href = "/Login")}
          >
            {" "}
            Login{" "}
          </button>

          <button
            id="register"
            className="button"
            onClick={(event) => (window.location.href = "/Signup")}
          >
            {" "}
            Signup{" "}
          </button>

          <button
            id="about"
            className="button"
            onClick={(event) => (window.location.href = "/about")}
          >
            {" "}
            About{" "}
          </button>
        </div> */}
        </div>
      </div>
    );
  }
}
export default home;
