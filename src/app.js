import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsRoutes from "./routes/views.router.js";
import __dirname from "./utils.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Configuracion del servidor para recibir JSON //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar motor de plantilla handlebars //
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Ubicacion carpeta public //
app.use(express.static(__dirname + "/public"));

// Ruta telemetria //
app.use("/ping", (req, res) => {
  res.send("pong");
});

// Usando router y handlebars //
app.use("/socket", viewsRoutes);

// Instanciamos socket con el puerto //
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});

// Instanciamos socket //
const socketServer = new Server(httpServer);

const logs = [];
socketServer.on("connection", (socket) => {
  // TODO - Se implemta todo lo relacionado a sockets

  // Esto lo ve cualquier user que se conecte
  socketServer.emit("messageLogs", logs);

  // Ejemplo Chat Basico
  socket.on("message", (data) => {
    logs.push(data);

    // Enviar los logs a los clientes
    socketServer.emit("messageLogs", logs);
  });

  // hacemos un broadcast del nuevo usuario que se conecta al chat
  // Notificacion push al resto de los usuarios
  socket.on("userConnected", (data) => {
    console.log(data);
    socket.broadcast.emit("userConnected", data.user);
  });
});
