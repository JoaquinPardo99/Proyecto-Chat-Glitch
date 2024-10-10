const socket = io();

const chatBox = document.getElementById("chatBox");
let user;

Swal.fire({
  icon: "info",
  title: "Socket conectado",
  input: "text",
  text: "Ingrese su username",
  color: "#116aad",

  inputValidator: (value) => {
    if (!value) {
      return "Por favor ingrese un nombre de usuario";
    } else {
      socket.emit("userConnected", { user: value });
    }
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;

  const myName = document.getElementById("myName");
  myName.innerText = user;
});

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    } else {
      Swal.fire({
        icon: "warning",
        title: "Alerta",
        text: "Por favor, ingrese un mensaje",
      });
    }
  }
});

socket.on("messageLogs", (data) => {
  const messageLogs = document.getElementById("messageLogs");
  let logs = "";

  data.forEach((log) => {
    logs += `<div>
        <span>${log.user}: </span>${log.message}:
      </div>`;
  });
  messageLogs.innerHTML = logs;
});

socket.on("userConnected", (user) => {
  let message = `Nuevo usuario conectado: ${user}`;
  Swal.fire({
    icon: "info",
    title: "Nuevo usuario ingreso a la sala",
    text: message,
    toast: true,
    position: "top-right",
  });
});
