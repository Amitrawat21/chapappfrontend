import React, { useEffect, useState } from "react";
import { FaYoutube } from "react-icons/fa6";
import ChatLists from "./ChatLists"; // Assuming correct path to ChatLists component
import InputText from "./Inputext.jsx";
import UserLogin from "./UserLogin"; // Assuming correct path to UserLogin component
import socketIOClient from "socket.io-client";

const ChatContainer = () => {
    const [user, setUser] = useState(localStorage.getItem("user"));
    const [room, setRoom] = useState(localStorage.getItem("room"));
    const socketio = socketIOClient("https://chatappbackend-75co.onrender.com");
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (user && room) {
            socketio.emit('joinRoom', { username: user, room });

            socketio.on("chat", (chats) => {
                setChats(chats || []); // Ensure chats is always an array
            });

            socketio.on('message', (msg) => {
                setChats((prevChats) => [...prevChats, msg]);
            });

            return () => {
                socketio.off('chat');
                socketio.off('message');
            };
        }
    }, [user, room]);

    const addMessage = (chat) => {
        const newChat = {
            username: user,
            message: chat,
            avatar: localStorage.getItem("avatar"),
            room
        };
        socketio.emit('newMessage', newChat);
    };

    const Logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem('room');
        localStorage.removeItem('avatar');
        setUser('');
        setRoom('');
    };

    return (
        <div className="App">
            {user && room ? (
                <div className="home">
                    <div className="chats_header"  >
                        <h4  className="username">{user}</h4>
                        <h4 className="roomno">room no : {room}</h4>
                       
                        <p className="chats_logout" onClick={Logout}>
                          logout
                        </p>
                    </div>
                    <ChatLists chats={chats} currentUser={user} />
                    <InputText addMessage={addMessage} />
                </div>
            ) : (
                <UserLogin setUser={setUser} setRoom={setRoom} />
            )}
        </div>
    );
};

export default ChatContainer;
