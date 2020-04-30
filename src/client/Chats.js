import React, { Component, useState } from "react";
import { useQuery, useMutation } from "react-apollo";
import gql from "graphql-tag";
import { Loading } from "./components/loading";

const GET_CHATS = gql`
  query chats {
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

const GET_CHAT = gql`
  query chat($chatId: String!) {
    chat(chatId: $chatId) {
      id
      messages {
        id
        text
        user {
          id
        }
      }
      users {
        id
        avatar
        username
      }
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation addMessage($message: MessageInput!) {
    addMessage(message: $message) {
      id
      text
      user {
        id
      }
    }
  }
`;

export const Chats = () => {
  const { loading, error, data } = useQuery(GET_CHATS);
  const [openChats, setOpenChats] = useState([]);

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

  const openChat = id => {
    let _openChats = openChats.slice();

    if (_openChats.indexOf(id) === -1) {
      if (_openChats.length > 2) {
        _openChats = _openChats.slice(1);
      }
      _openChats.push(id);
    }

    setOpenChats(_openChats);
  };

  const closeChat = id => {
    let _openChats = openChats.slice();
    const index = _openChats.indexOf(id);

    _openChats.splice(index, 1);

    setOpenChats(_openChats);
  };

  return (
    <div className="wrapper">
      <div className="chats">
        {data.chats.map((chat, i) => (
          <div
            key={"chat" + chat.id}
            className="chat"
            onClick={() => openChat(chat.id)}
          >
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
                <span>
                  {chat.lastMessage && shorten(chat.lastMessage.text)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="openChats">
        {openChats.map((chatId, i) => (
          <Chat key={"chat " + chatId} id={chatId} />
        ))}
      </div>
    </div>
  );
};

export const Chat = ({ id }) => {
  const [textInput, setTextInput] = useState("");

  const [addMessage] = useMutation(ADD_MESSAGE, {
    update(cache, { data: { addMessage } }) {
      const data = cache.readQuery({
        query: GET_CHAT,
        variables: { chatId: id }
      });
      data.chat.messages.push(addMessage);
      cache.writeQuery({ query: GET_CHAT, variables: { chatId: id }, data });
    }
  });

  const { loading, error, data } = useQuery(GET_CHAT, {
    variables: { chatId: id }
  });

  if (loading) return <Loading />;
  if (error)
    return (
      <Error>
        <p>{error.message}</p>
      </Error>
    );
  if (!data) return <p>Not found</p>;

  const { chat } = data;

  const onChangeChatInput = (event, id) => {
    event.preventDefault();
    setTextInput(event.target.value);
  };

  const handleKeyPress = (event, id, addMessage) => {
    if (event.key === "Enter" && textInput) {
      addMessage({
        variables: { message: { text: textInput, chatId: id } }
      }).then(() => {
        setTextInput("");
      });
    }
  };

  return (
    <div className="chatWindow">
      <div className="header">
        <span>{chat.users[0].username}</span>
        <button className="close">X</button>
      </div>
      <div className="messages">
        {chat.messages.map((message, j) => (
          <div
            key={"message" + message.id}
            className={
              "message " + (message.user.id === "VsJxIZ485" ? "left" : "right")
            }
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="input">
        <input
          type="text"
          value={textInput}
          onChange={event => onChangeChatInput(event, chat.id)}
          onKeyPress={event => {
            handleKeyPress(event, chat.id, addMessage);
          }}
        />
      </div>
    </div>
  );
};
