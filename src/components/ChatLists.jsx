import React from 'react';

const ChatLists = ({ chats, currentUser }) => {
    return (
        <div className='chats_list'>
            {
                chats.map((chat, index) => {
                    const isCurrentUser = chat.username === currentUser;

                    return (
                        <div key={index} className={isCurrentUser ? 'chat_sender' : 'chat_receiver'}>
                            <img src={chat.avatar} alt="Avatar" />
                            <p>
                                <strong style={{color : "blue"}}>{chat.username}</strong><br />
                                {chat.message}
                            </p>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default ChatLists;
