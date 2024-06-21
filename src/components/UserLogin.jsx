import React, { useState } from 'react'
import {FaReact} from 'react-icons/fa6'
import '../style.css'
import _ from 'lodash'


const UserLogin = ({ setUser, setRoom }) => {
    const [userName, setUserName] = useState('');
    const [room, setRoomInput] = useState('');

    const handleUser = () => {
        if (!userName || !room) return;
        localStorage.setItem('user', userName);
        localStorage.setItem('room', room);
        setUser(userName);
        setRoom(room);
        localStorage.setItem('avatar', `https://picsum.photos/id/${_.random(1, 1000)}/200/300`);
    };

    return (
        <div className='login_container'>
            <div className='login_title'>
             
                <h1>Chat App</h1>
            </div>
            <div className='login_form'>
                <input type="text" placeholder='Enter a Unique Name' onChange={(e) => setUserName(e.target.value)} />
                <input type="text" placeholder='Enter Room ID' onChange={(e) => setRoomInput(e.target.value)} />
               
            </div>

            <button onClick={handleUser}>Login</button>
        </div>
    );
};

export default UserLogin