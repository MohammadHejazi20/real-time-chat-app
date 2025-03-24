"use client";
import { useEffect, useState } from "react";
import { JoinCard } from "@/components/join-card";
import io from "socket.io-client";
import Show from "@/components/show";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type MessageType = {
  userId: string;
  userMessage: string;
  userName: string;
};
const socket = io("http://localhost:3001");

export default function Home() {
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

    console.log("Socket connected");
    console.log("Socket ID: ", socket.id);
    console.log("Users: ", users);
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
    <div className="flex items-center justify-center h-screen">
      <Show>
        <Show.When isTrue={!nameSet}>
          <JoinCard
            name={name}
            onNameChange={(v) => {
              setName(v);
            }}
            onSubmit={() => {
              handleSetName();
            }}
          />
        </Show.When>
        <Show.Else>
          <Card className="max-w-96 max-h-96 w-full h-full">
            <CardHeader className="text-center">Active Users</CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex items-center gap-3">
                  {users.map((user) => (
                    <Avatar key={user.id} className="mb-2 ">
                      <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </Show.Else>
      </Show>
      ¸
    </div>
  );
}
