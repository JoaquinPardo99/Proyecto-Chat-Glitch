const socket = io();

const input = document.getElementById("textoEntrada");
const log = document.getElementById("log");

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    socket.emit("nuevo_mensaje", input.value);
    input.value = "";
  }
});

socket.on("logs", (data) => {
  let logs = "";
  data.log.forEach((log) => {
    logs += `${log.socketid} dice: ${log.message}<br/>`;
  });
  log.innerHTML = logs;
});
