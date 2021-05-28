import React, { Component } from "react";
import Firebase from "firebase";
import equal from "fast-deep-equal";
import "../searchResults.css";

class SearchResults extends Component {
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
    this.retrieveMessages = this.retrieveMessages.bind(this);
  } // end constructor

  async componentDidMount() {
    await this.setState({
      searchTerm: this.props.location.search
        .toString()
        .toLowerCase()
        .split("=")[1]
    });
    console.log(this.state.searchTerm);
    await this.retrieveMessages(this.state.searchTerm);
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    let searchTerm = this.props.location.search
      .toString()
      .toLowerCase()
      .split("=")[1];
    console.log("Search term is " + searchTerm);
    if (
      !equal(
        searchTerm,
        prevProps.location.search.toString().toLowerCase().split("=")[1]
      )
    ) {
      // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
      await this.setState({ searchTerm: searchTerm });
      await this.retrieveMessages(this.state.searchTerm);
      console.log("done");
    }
  }

  async retrieveMessages(keywordToSearch) {
    let ref = Firebase.database().ref("posts");
    let messagesRetrievedFromDB = [];
    console.log();
    await ref.once("value").then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        let userObject = {};
        let userId = childSnapshot.key;
        userObject["userId"] = userId;
        let userPosts = [];
        let snapshotValues = childSnapshot.val();
        console.log(snapshotValues);
        for (let m in snapshotValues) {
          if (
            snapshotValues[m]["content"]
              .toLowerCase()
              .includes(keywordToSearch) &&
            snapshotValues[m]["visibility"] === "public"
          ) {
            let currObject = {
              timestamp: m,
              visibility: snapshotValues[m]["visibility"],
              content: snapshotValues[m]["content"]
            };
            userPosts.push(currObject);
          }
        }

        if (userPosts.length > 0) {
          userObject["posts"] = userPosts;
          messagesRetrievedFromDB.push(userObject);
        }
      });
    });
    await this.setState({ dbData: messagesRetrievedFromDB });
    console.log(this.state.dbData);
  }

  render() {
    return (
      <div>
        <br />
        <h1 id="resultSearch">
          Results for: &nbsp; '
          {this.props.location.search.toString().split("=")[1] != null &&
            this.props.location.search.toString().split("=")[1]}
          '
        </h1>

        {this.state.dbData.length <= 0 && (
          <p id="noMatch">
            There is nothing in the database matching this term.
          </p>
        )}

        {this.state.dbData.length > 0 && (
          <>
            <p id="match">
              There are {this.state.dbData.length} objects in the DB matching
              the search{" "}
              <b>'{this.props.location.search.toString().split("=")[1]}</b>'
            </p>
            <ul>
              {this.state.dbData.map((user) => (
                <>
                  <li>{user["userId"]}</li>
                  <ul>
                    {user["posts"].map((post, index) => (
                      <li key={index}>
                        {post.timestamp}: &nbsp;{post.content}
                      </li>
                    ))}
                  </ul>
                </>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }
}

export default SearchResults;
