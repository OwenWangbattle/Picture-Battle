const http = require("http");
const server = http.createServer((req, res) => {});

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});

const rooms = {};

io.on("connection", (socket) => {
    console.log("A user connected");
    let currentRoom = null;

    socket.on("fetch room", (_) => {
        console.log("fetch room");
        socket.emit(
            "room update",
            Object.keys(rooms).map((room) => {
                return {
                    name: room,
                    status: rooms[room].status,
                    player_count: rooms[room].player_count,
                };
            })
        );
    });

    socket.on("create room", (message) => {
        const { name, pwd } = message;
        if (!rooms[name]) {
            rooms[name] = {
                pwd,
                status: "waiting",
                player_count: 0,
                players: [],
            };
        } else socket.emit("error", "name exist");
    });

    // socket.on("delete room", (message) => {});

    socket.on("join room", (message) => {
        const { name, pwd } = message;
        console.log(`join room: ${name}`);
        if (
            rooms[name] &&
            // rooms[name].pwd === pwd &&       this is a to do
            rooms[name].status === "waiting" &&
            rooms[name].player_count <= 2
        ) {
            currentRoom = name;
            socket.join(currentRoom);
            for (const player of rooms[currentRoom].players)
                socket.emit("user join", player);
            rooms[currentRoom].player_count += 1;
            rooms[currentRoom].players.push(socket.id);
            io.to(currentRoom).emit("user join", socket.id);
        } else socket.emit("error", "join room failed");
    });

    socket.on("leave room", (_) => {
        try {
            if (currentRoom) {
                socket.leave(currentRoom);
                io.to(currentRoom).emit("user left", socket.id);
                rooms[currentRoom].player_count -= 1;
                rooms[currentRoom].players = rooms[currentRoom].players.filter(
                    (item) => item !== socket.id
                );
                if (rooms[currentRoom].player_count === 0)
                    delete rooms[currentRoom];
                currentRoom = null;
            }
        } catch (e) {
            socket.emit("error", "leave room failed");
        }
    });

    socket.on("start game", (message) => {
        if (!currentRoom) socket.emit("error", "hasn't joined a room");
        else if (rooms[currentRoom]) {
            rooms[currentRoom].status = "started";
            socket.to(currentRoom).emit("game start");
        } else socket.emit("error", "room does not exist");
    });

    socket.on("game payload", (message) => {
        const { controls, damage, death } = message;
        // to do: handle server game core logic
    });
});

server.listen(3001, () => {
    console.log("WebSocket server listening on port 3001");
});
