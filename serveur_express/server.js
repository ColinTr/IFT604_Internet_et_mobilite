const app = require("./src/app");
const http = require("http");
const config = require("./src/utils/config");
const logger = require("./src/utils/logger");

const server = http.createServer(app);

// Chargement de socket.io
const options = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
};
const io = require("socket.io")(server, options);

// Quand un client se connecte
io.on("connection", (socket) => {
  socket.on("message", (message) => {
    socket.broadcast.emit("message", {
      content: message.content,
      author: message.author,
    });
  });
});

server.listen(config.PORT, () => {
  const port = config.PORT || 5000;

  logger.info(`Serveur en cours sur le port ${port}`);
});
