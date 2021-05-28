import { React, Component } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import { Modal, Button } from "react-bootstrap";
import "../myDiary.css";

class MyDiary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbData: [],
      editModalOpen: false,
      editTextValue: "",
      postToReport: "",
      reportModalOpen: false,
      reportTextValue: "",
      textInputValue: "",
      userLocal: null
    };
    this.getMessagesFromDatabase = this.getMessagesFromDatabase.bind(this);
    this.convertUnixTimestamp = this.convertUnixTimestamp.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.handleEditTextChange = this.handleEditTextChange.bind(this);
    this.handleEditSubmission = this.handleEditSubmission.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextSubmission = this.handleTextSubmission.bind(this);
  }

  async componentDidMount() {
    // as soon as the component mounts, get the most recent messages from the firebase database.
    await this.setState({ userLocal: firebase.auth().currentUser });
    this.getMessagesFromDatabase();
  }

  convertUnixTimestamp(timestamp) {
    return new Date(parseInt(timestamp)).toLocaleString("en-GB");
  }

  deleteEntry(timestamp) {
    let user = firebase.auth().currentUser;
    let uid = user.uid;

    firebase.database().ref(`posts/${uid}/${timestamp}`).remove();
  }

  async handleEditSubmission() {
    let user = firebase.auth().currentUser;
    let uid = user.uid;
    let toAdd = {};
    toAdd["content"] = this.state.editTextValue;
    await firebase
      .database()
      .ref(`posts/${uid}/${this.state.postToEdit}`)
      .update(toAdd);

    this.closeEditModal();
  }

  handleEditTextChange(event) {
    this.setState({ editTextValue: event.target.value });
  }

  handleTextChange(event) {
    this.setState({ textInputValue: event.target.value });
  }

  handleTextSubmission(event) {
    event.preventDefault();
    if (this.state.textInputValue.length > 300)
      return alert(
        "Your post is too long! Please make it 300 characters or less."
      );

    let user = firebase.auth().currentUser;
    let uid = user.uid;
    let currentTime = Date.now().toString();
    let toAdd = {};
    toAdd["content"] = this.state.textInputValue;

    if (document.getElementById("privateCheckbox").checked)
      toAdd["visibility"] = "private";
    else toAdd["visibility"] = "public";

    this.setState({ textInputValue: "" });
    firebase.database().ref(`posts/${uid}/${currentTime}`).update(toAdd);
  }

  getMessagesFromDatabase() {
    //let user = Firebase.auth().currentUser;
    let user = firebase.auth().currentUser;
    let uid = user.uid;
    let ref = firebase.database().ref("posts").child(uid);

    ref.on("value", (snapshot) => {
      // json array
      let msgData = snapshot.val();
      let newMessagesFromDB = [];
      // create a JSON object version of our object.
      for (let m in msgData) {
        let currObject = {
          timestamp: m,
          visibility: msgData[m]["visibility"],
          content: msgData[m]["content"],
          flags: JSON.stringify(msgData[m]["flags"])
        };
        newMessagesFromDB.push(currObject);
      } // end for loop
      // set state = don't use concat.
      console.log(newMessagesFromDB);
      newMessagesFromDB = newMessagesFromDB.reverse();
      this.setState({ dbData: newMessagesFromDB });
    }); // end of the on method
  } // end of getMessagesFromDatabase()

  openEditModal = (timestamp, content) => {
    this.setState({ editModalOpen: true });
    this.setState({ postToEdit: timestamp });
    this.setState({ editTextValue: content });
  };

  closeEditModal = () => this.setState({ editModalOpen: false });

  render() {
    return (
      <>
        <h1 className="headings" id="myDiaryHeading">
          My Diary <hr />
        </h1>

        <div style={{ textAlign: "center" }}>
          <h3 id="entryHead">
            <u>My entries</u>
          </h3>
          <br />
          <div className="entryList">
            {this.state.dbData.length > 0 &&
              this.state.dbData.map((post, index) => (
                <>
                  <div id={index}>
                    {post["content"]}
                    <br />
                    <i style={{ fontSize: "14px" }}>
                      {this.convertUnixTimestamp(post["timestamp"])}
                    </i>
                    <br />
                    <button
                      onClick={() =>
                        this.openEditModal(post.timestamp, post.content)
                      }
                    >
                      Edit this entry
                    </button>
                    &nbsp;
                    <button onClick={() => this.deleteEntry(post.timestamp)}>
                      Delete this entry
                    </button>
                    <hr />
                  </div>

                  {this.state.editModalOpen ? (
                    <Modal
                      show={this.state.editModalOpen}
                      onHide={this.closeEditModal}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Edit a post</Modal.Title>
                      </Modal.Header>
                      <Modal.Body
                        as="textarea"
                        onChange={this.handleEditTextChange}
                        value={this.state.editTextValue}
                        placeholder="Enter edit here"
                      ></Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="primary"
                          type="submit"
                          onClick={() =>
                            this.handleEditSubmission(post.timestamp)
                          }
                        >
                          Submit
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  ) : null}
                </>
              ))}
          </div>
        </div>
        <div className="diaryEntry">
          <form
            onSubmit={(e) => {
              this.handleTextSubmission(e);
            }}
          >
            <textarea
              value={this.state.textInputValue}
              onChange={this.handleTextChange}
            />
            <br />
            {300 - this.state.textInputValue.length} <input type="submit" />
            <br />
            <label for="privateCheckbox">Make post private</label>
            <input id="privateCheckbox" type="checkbox"></input>
          </form>
        </div>
      </>
    );
  }
}

export default MyDiary;
