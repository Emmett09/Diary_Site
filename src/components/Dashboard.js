import React, { Component } from "react";
import Firebase from "firebase";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbData: [],
      fetched: false,
      currentUser: "",
      searchTerm: this.props.location.search
        .toString()
        .toLowerCase()
        .split("=")[1]
    };
    this.convertUnixTimestamp = this.convertUnixTimestamp.bind(this);
    this.handleReportTextChange = this.handleReportTextChange.bind(this);
    this.retrieveMessages = this.retrieveMessages.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
  } // end constructor

  async componentDidMount() {
    await this.setCurrentUser();
    await this.retrieveMessages();
  }

  convertUnixTimestamp(timestamp) {
    return new Date(parseInt(timestamp)).toLocaleString("en-GB");
  }

  async handleReportSubmission() {
    let user = Firebase.auth().currentUser;
    let uid = user.uid;
    let toAdd = {};
    toAdd[uid] = this.state.reportTextValue;
    let postAuthorId = this.state.reportedPostAuthorId;

    await Firebase.database()
      .ref(`posts/${postAuthorId}/${this.state.postToReport}/flags`)
      .update(toAdd);
    let flags = await Firebase.database()
      .ref(`posts/${postAuthorId}/${this.state.postToReport}/flags`)
      .get();

    if (Object.keys(flags.val()).length >= 2) {
      let visibilityUpdate = {};
      visibilityUpdate["visibility"] = "hidden";
      await Firebase.database()
        .ref(`posts/${postAuthorId}/${this.state.postToReport}`)
        .update(visibilityUpdate);
    }

    this.closeModal();
  }

  handleReportTextChange(event) {
    this.setState({ reportTextValue: event.target.value });
  }

  async retrieveMessages() {
    let ref = Firebase.database().ref("posts");
    let messagesRetrievedFromDB = [];
    await ref.once("value").then(async function (snapshot) {
      for (let i in snapshot.val()) {
        let userId = i;
        let userName = "";
        let userDatabase = Firebase.database().ref(`users/${userId}`);
        await userDatabase.once("value").then(function (userNameSnapshot) {
          userName = userNameSnapshot.val()["username"];
        });

        let snapshotValues = snapshot.val()[i];
        for (let m in snapshotValues) {
          if (snapshotValues[m]["visibility"] === "public") {
            let currObject = {
              author: userName,
              authorId: i,
              timestamp: m,
              visibility: snapshotValues[m]["visibility"],
              content: snapshotValues[m]["content"]
            };
            console.log(currObject);
            messagesRetrievedFromDB.push(currObject);
          }
        }
        console.log(messagesRetrievedFromDB);
      }
    });
    await this.setState({ dbData: messagesRetrievedFromDB });
  }

  async setCurrentUser() {
    let userId = Firebase.auth().currentUser.uid;
    let userDatabase = Firebase.database().ref(`users/${userId}`);
    await userDatabase.once("value").then(
      function (userNameSnapshot) {
        this.setState({ currentUser: userNameSnapshot.val()["username"] });
      }.bind(this)
    );
  }

  sortByTimestamp(postA, postB) {
    let comparison = 0;

    let postADate = parseInt(postA.timestamp);
    let postBDate = parseInt(postB.timestamp);

    if (postADate > postBDate) comparison = -1;
    else if (postADate < postBDate) comparison = 1;
    else comparison = 0;

    return comparison;
  }

  openModal = (timestamp, authorId) => {
    this.setState({ reportModalOpen: true });
    this.setState({ postToReport: timestamp });
    this.setState({ reportedPostAuthorId: authorId });
    this.setState({ reportTextValue: "" });
    console.log(this.state.reportedPostAuthorId);
    console.log(authorId);
  };

  closeModal = () => this.setState({ reportModalOpen: false });

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1 id="newsfeedHead">User Posts</h1>
        <br />
        {this.state.dbData.length <= 0 && (
          <p>There is nothing in the database matching this term.</p>
        )}

        <div className="newsPosts">
          {this.state.dbData.length > 0 && (
            <>
              {this.state.dbData.sort(this.sortByTimestamp).map((post) => (
                <>
                  <b>{post.author}</b>
                  <br />
                  &nbsp;{post.content}
                  <br />
                  <i style={{ fontSize: "14px" }}>
                    {this.convertUnixTimestamp(post.timestamp)}
                  </i>
                  <br />
                  {post.author !== this.state.currentUser && (
                    <>
                      <button
                        onClick={() =>
                          this.openModal(post.timestamp, post.authorId)
                        }
                      >
                        Report this entry
                      </button>
                      {this.state.reportModalOpen ? (
                        <Modal
                          show={this.state.reportModalOpen}
                          onHide={this.closeModal}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Report a post</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form.Group>
                              <Form.Label>Report message: </Form.Label>
                              <Form.Control
                                type="text"
                                onChange={this.handleReportTextChange}
                                value={this.state.reportTextValue}
                                placeholder="Enter report here"
                              />
                            </Form.Group>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="primary"
                              type="submit"
                              onClick={() => this.handleReportSubmission()}
                            >
                              Submit
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      ) : null}
                    </>
                  )}
                  <hr />
                </>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Dashboard;
