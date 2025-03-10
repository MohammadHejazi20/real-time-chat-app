"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

type MessageType = {
  userId: string;
  userMessage: string;
  userName: string;
};
const socket = io("http://localhost:3001");

const Home = () => {
  const [name, setName] = useState<string>("");
  const [nameSet, setNameSet] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    socket.on("chat message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("users list", (users) => {
      setUsers(users);
    });

    return () => {
      socket.off("chat message");
      socket.off("users list");
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() === "") {
      return;
    }
    socket.emit("chat message", { id: socket.id, message: newMessage });
    setNewMessage("");
  };

  const handleSetName = () => {
    if (name) {
      socket.emit("set name", name);
      setNameSet(true);
    }
  };

  return (
    <div className="mx-auto">
      <div className="navbar bg-primary text-primary-content rounded-sm">
        <button className="btn btn-ghost text-xl text-cyan-50">
          Real-Time Chat
        </button>
      </div>
      {!nameSet ? (
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">Join Chat</h1>
            </div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
              <form className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control mt-6">
                  <button className="btn btn-primary" onClick={handleSetName}>
                    Join
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="">
          <div className="indicator m-5">
            <span className="indicator-item indicator-start badge badge-secondary"></span>
            <div className="bg-base-300 grid h-auto w-auto place-items-center rounded-md p-3 gap-3">
              <h2 className="text-xl font-bold mb-2">Connected Users</h2>
              <div className="">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="avatar online placeholder gap-2"
                  >
                    <div className="bg-neutral text-neutral-content w-16 rounded-full">
                      <span className="text-xl">{user.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col m-5">
            <h2 className="text-xl font-bold mb-2">Messages</h2>
            <div className="overflow-y-auto w-full">
              <div className="indicator w-full">
                <div className="card border w-full">
                  <div className="card-body w-full">
                    {messages.map((message, index) => (
                      <div key={index} className="chat chat-start ">
                        <div className="chat-bubble chat-bubble-success">
                          <span className="text-gray-500">
                            {message.userName}:{" "}
                          </span>
                          {message.userMessage}
                        </div>
                      </div>
                    ))}
                    <div className="join w-full">
                      <input
                        className="input input-bordered join-item w-full rounded-l-full"
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            sendMessage();
                          }
                        }}
                      />
                      <button
                        className="btn join-item rounded-r-full"
                        onClick={sendMessage}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
