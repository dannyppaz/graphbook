import React, { Component } from "react";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";

const GET_CHATS = gql`
  {
    chats {
      id
      users {
        id
        avatar
        username
      }
      lastMessage {
        text
      }
    }
  }
`;

export const Chats = () => {
  const { loading, error, data } = useQuery(GET_CHATS);

  console.log("LOGINFO: Chats -> error", error);
  console.log("LOGINFO: Chats -> loading", loading);
  console.log("LOGINFO: Chats -> data", data);

  if (loading) return "...Loading";
  if (error) return error.message;
  if (!data) return null;

  const usernamesToString = users => {
    const userList = users.slice(1);
    var usernamesString = "";

    for (var i = 0; i < userList.length; i++) {
      usernamesString += userList[i].username;
      if (i - 1 === userList.length) {
        usernamesString += ", ";
      }
    }
    return usernamesString;
  };
  const shorten = text => {
    if (text.length > 12) {
      return text.substring(0, text.length - 9) + "...";
    }

    return text;
  };

  return (
    <div className="chats">
      {data.chats.map((chat, i) => (
        <div key={"chat" + chat.id} className="chat">
          <div className="header">
            <img
              src={
                chat.users.length > 2
                  ? "/public/group.png"
                  : chat.users[0].avatar
              }
            />
            <div>
              <h2>{shorten(usernamesToString(chat.users))}</h2>
              <span>{chat.lastMessage && shorten(chat.lastMessage.text)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
