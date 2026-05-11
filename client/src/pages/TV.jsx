import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";

const socket = io("https://YOUR-RENDER-URL.onrender.com");

function TV() {

  const [command, setCommand] = useState("");
  const [link, setLink] = useState("");

  const roomId = "ROOM123";

  useEffect(() => {

    socket.emit("join-room", roomId);

    socket.on("receive-command", (cmd) => {
      setCommand(cmd);
    });

    socket.on("receive-link", (receivedLink) => {
      setLink(receivedLink);

      // Open automatically
      window.open(receivedLink, "_blank");
    });

    return () => {
      socket.off("receive-command");
      socket.off("receive-link");
    };

  }, []);

  const qrValue =
    `${window.location.origin}/remote/${roomId}`;

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "40px",
      }}
    >
      <h1>Smart TV</h1>

      <QRCodeCanvas
        value={qrValue}
        size={250}
      />

      <h2>{command}</h2>

      <p>{link}</p>
    </div>
  );
}

export default TV;