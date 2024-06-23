"use client";

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import styles from "./page.module.scss";

const socket = io("http://localhost:3001");

const renderRoomList = (rooms, isRoomFetching, joinRoom) => {
    if (isRoomFetching) {
        return <div>loading...</div>;
    }
    return (
        <>
            <ul className={styles.header}>
                <span>Room Name</span>
                <span>Status</span>
                <span>Players</span>
                <span></span>
            </ul>
            {rooms.map((room) => {
                return (
                    <ul key={room.name}>
                        <span>{room.name}</span>
                        <span>{room.status}</span>
                        <span>{room.player_count}/2</span>
                        <button onClick={joinRoom.bind(null, room.name)}>
                            Join Room
                        </button>
                    </ul>
                );
            })}
        </>
    );
};

const renderRoom = (players, onGameStart, onLeaveRoom) => {
    return (
        <div className={styles.room}>
            <h1>Room Info</h1>
            <li>
                {players.map((player, index) => {
                    return (
                        <ul key={player}>
                            <span>Player {index + 1}</span>
                            <span>{player}</span>
                        </ul>
                    );
                })}
            </li>
            <div className={styles.buttons}>
                <button onClick={onGameStart} disabled={players.length !== 2}>
                    Start Game
                </button>
                <button onClick={onLeaveRoom}>Leave Room</button>
            </div>
        </div>
    );
};

const Index = () => {
    const [rooms, setRooms] = useState([]);
    const [isRoomFetching, setIsRoomFetching] = useState(false);

    const [createRoomOpen, setCreateRoomOpen] = useState(false);
    const [newRoomInfo, setNewRoomInfo] = useState({
        name: "",
        password: "",
    });

    const [inRoom, setInRoom] = useState(false);
    const [players, setPlayers] = useState([]);

    const onNewRoomInfoChange = (item, value) => {
        if (typeof value !== "string") value = value.target.value;
        setNewRoomInfo((prev) => {
            return {
                ...prev,
                [item]: value,
            };
        });
    };

    useEffect(() => {
        socket.on("chat message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on("room update", (rooms) => {
            // console.log(rooms);
            setRooms(rooms);
            setIsRoomFetching((prev) => {
                if (prev) return false;
            });
        });

        socket.on("user join", (id) => {
            // console.log("user join");
            setPlayers((players) => {
                for (const player of players) if (player === id) return players;
                return [...players, id];
            });
        });

        socket.on("user left", (id) => {
            setPlayers((players) => {
                return players.filter((player) => player !== id);
            });
        });

        socket.on("error", console.error);

        setIsRoomFetching(true);
        fetchRoom();
    }, []);

    const onGameStart = () => {
        socket.emit("start game");
        console.log("game started!");
    };

    const joinRoom = (name) => {
        socket.emit("join room", {
            name: name,
            pwd: "",
        });
        setPlayers([]);
        setInRoom(true);
    };

    const leaveRoom = () => {
        socket.emit("leave room");
        setPlayers([]);
        setInRoom(false);
        setIsRoomFetching(true);
        fetchRoom();
    };

    const fetchRoom = () => {
        socket.emit("fetch room");
    };

    const createRoom = () => {
        // to do: form validation
        socket.emit("create room", {
            name: newRoomInfo.name,
            pwd: newRoomInfo.password,
        });
        setCreateRoomOpen(false);
        setNewRoomInfo({
            name: "",
            password: "",
        });
        // setIsRoomFetching(true);
        // fetchRoom();
        joinRoom(newRoomInfo.name);
    };

    return (
        <div className={styles.container}>
            <div>
                {inRoom ? (
                    renderRoom(players, onGameStart, leaveRoom)
                ) : (
                    <>
                        <h1>Rooms</h1>
                        {!!createRoomOpen ? (
                            <>
                                <div className={styles.form}>
                                    <div className={styles.input}>
                                        <span>Room Name</span>
                                        <input
                                            type="text"
                                            value={newRoomInfo.name}
                                            onChange={onNewRoomInfoChange.bind(
                                                null,
                                                "name"
                                            )}
                                        />
                                    </div>
                                    <div className={styles.input}>
                                        <span>Room Password</span>
                                        <input
                                            type="text"
                                            value={newRoomInfo.password}
                                            onChange={onNewRoomInfoChange.bind(
                                                null,
                                                "password"
                                            )}
                                        />
                                    </div>
                                </div>
                                <button onClick={createRoom}>Create</button>
                            </>
                        ) : (
                            <>
                                <li className={styles.roomlist}>
                                    {renderRoomList(
                                        rooms,
                                        isRoomFetching,
                                        joinRoom
                                    )}
                                </li>
                                <div>
                                    <button
                                        onClick={setCreateRoomOpen.bind(
                                            null,
                                            true
                                        )}
                                    >
                                        Create New Room
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Index;
