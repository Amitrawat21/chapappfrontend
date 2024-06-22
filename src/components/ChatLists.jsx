import React, { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";

const ChatLists = ({ chats, currentUser, room, setChats }) => {
  const [showDeleteId, setShowDeleteId] = useState(null);

  const handleShowDelete = (id) => {
    setShowDeleteId(id === showDeleteId ? null : id);
  };

  const deleteChat = async (id) => {
    console.log(id, "this is id");
    try {
      const res = await axios.delete(`http://localhost:8000/chat/${id}`);
      console.log(res);
      if (res.data.success) {
        console.log("Chat deleted successfully");

        // Update the local state to remove the deleted chat
        setChats((prevChats) => prevChats.filter((chat) => chat._id !== id));
        setShowDeleteId(null); // Hide delete icon after successful deletion
      } else {
        console.log("Chat deletion failed");
      }
    } catch (error) {
      console.log("Error deleting chat:", error);
    }
  };

  return (
    <div className="chats_list">
      {chats.map((chat, index) => {
        const isCurrentUser = chat.username === currentUser;
        const showDelete = showDeleteId === chat._id;

        return (
          <div
            key={index}
            className={isCurrentUser ? "chat_sender" : "chat_receiver"}
          >
            <img src={chat.avatar} alt="Avatar" />
            <p onClick={() => handleShowDelete(chat._id)}>
              <strong style={{ color: "blue" }}>{chat.username}</strong>
              <br />
              {chat.message}
            </p>

            {showDelete && (
              <div className="delete" onClick={() => deleteChat(chat._id)}>
                <ClearIcon style={{ width: "20px", margin: "-9px" }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatLists;
