import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { ROW } from './row';
import "./message.css";


/* getAllChatList */
const Sidebar = ({ users, listClicked,history }) => {
  const {location} = history;
  return (
    // <div className="chatting-user-list-section">
    <Fragment>
      {users.map(list => {
        return (
            <ROW
              key={list._id}
              list={list}
              location={location}
              listClicked={listClicked}
            />
        );
      })}
     </Fragment>
  )
}

export default Sidebar;