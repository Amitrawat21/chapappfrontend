import React, { useEffect, useState, useRef } from "react";
import ChatLists from "./ChatLists.jsx";
import InputText from "./Inputext.jsx";
import UserLogin from "./UserLogin"; // Assuming correct path to UserLogin component
import socketIOClient from "socket.io-client";
import Dehaze from "@mui/icons-material/Dehaze";
import axios from "axios";

const ChatContainer = () => {
  const [showbar, setShowbar] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [room, setRoom] = useState(localStorage.getItem("room"));
  const [chats, setChats] = useState([]);
  const sidebarRef = useRef(null);
  const dehazeButtonRef = useRef(null);
  const socketio = useRef(null);

  useEffect(() => {
    socketio.current = socketIOClient("http://localhost:8000");

    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        dehazeButtonRef.current &&
        !dehazeButtonRef.current.contains(event.target)
      ) {
        setShowbar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      socketio.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user && room) {
      socketio.current.emit("joinRoom", { username: user, room });

      socketio.current.on("chat", (chats) => {
        setChats(chats || []); // Ensure chats is always an array
      });

      socketio.current.on("message", (msg) => {
        setChats((prevChats) => [...prevChats, msg]);
      });

      return () => {
        socketio.current.emit("leaveRoom", { username: user, room }); // Leave the room when the component unmounts
        socketio.current.off("chat");
        socketio.current.off("message");
      };
    }
  }, [user, room]);

  const handleSideBar = (event) => {
    event.stopPropagation();
    setShowbar(!showbar);
  };

  const addMessage = (chat) => {
    const newChat = {
      username: user,
      message: chat,
      avatar: localStorage.getItem("avatar"),
      room,
    };
    socketio.current.emit("newMessage", newChat);
  };

  const Logout = () => {
    socketio.current.emit("leaveRoom", { username: user, room }); // Leave the room when logging out
    localStorage.removeItem("user");
    localStorage.removeItem("room");
    localStorage.removeItem("avatar");
    setUser("");
    setRoom("");
    setChats([]); // Clear the chat messages
  };

  const deleteAllChat = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/chat/delete/${room}`
      );
      if (res.data.result.acknowledged) {
        alert("All chats are deleted");
        setChats([]); // Correctly update the state to clear chats
      } else {
        alert("Failed to delete chats");
      }
    } catch (error) {
      console.log("Error deleting chats:", error);
    }
  };

  useEffect(() => {
    setShowbar(false);
  }, [user, room]);

  return (
    <div className="App">
      {user && room ? (
        <div className="home">
          <div className="chats_header">
            <h4 className="username">{user}</h4>
            <h4 className="roomno">Room no: {room}</h4>

            <div onClick={handleSideBar} ref={dehazeButtonRef}>
              <Dehaze className="dehaze" />
            </div>

            <div ref={sidebarRef} className={showbar ? "sidebar" : "nosidebar"}>
              <div className="optionss">
                <div className="singleopttion" onClick={Logout}>
                  Logout
                </div>
                <div className="singleopttion" onClick={deleteAllChat}>
                  Delete all Chats
                </div>
              </div>
            </div>
          </div>
          <ChatLists chats={chats} currentUser={user} setChats={setChats} />
          <InputText addMessage={addMessage} />
        </div>
      ) : (
        <UserLogin setUser={setUser} setRoom={setRoom} setChats={setChats} />
      )}
    </div>
  );
};

export default ChatContainer;
