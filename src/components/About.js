import React, { Component } from "react";
import "../styles.css";

class About extends Component {
  render() {
    return (
      <div className="About">
        <h2 id="aboutHeading">Team 03 Online Journal</h2>
        <p id="aboutInfo">
          This is a collaborative effort from the members of CS353's Team 03.
          The purpose of this site is to be able to blog anonymously or
          completely privately, and also to search other user's public posts in
          order to read the blog entries they are happy to share. An
          unregistered or signed out user can view sample posts of the day from
          the home screen, but if a user wants to use all features they must
          register and sign in. From here a user is able to view a newsfeed of
          ordered public posts, as well as create, edit, view, and delete their
          own posts in the 'My Diary' section.
        </p>
      </div>
    );
  }
}

export default About;
