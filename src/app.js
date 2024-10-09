import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsRoutes from "./routes/views.router.js";
import __dirname from "./utils.js";

const app = express();
const PORT = 8080;

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

const log = [];

// Implementacion de TODO lo relacionado a socket //
socketServer.on("connection", (socket) => {
  socket.emit("logs", { log });
  socket.on("mensaje_key", (data) => {
    console.log(data);
  });

  // Enviar mensaje al cliente //
  /*  socket.emit("msg_02", "Hola desde el server, buenas noches");

  socket.broadcast.emit(
    "msg_03",
    "Este evento es para todos los sockets, menos el socket de donde se emitio el mensaje"
  );

  socketServer.emit(
    "msg_04",
    "Todos los que esten conectados ven este mensaje"
  ); */

  socket.on("nuevo_mensaje", (data) => {
    log.push({ socketid: socket.id, message: data });

    // Enviar los logs al cliente //
    socketServer.emit("logs", { log });
  });
});
