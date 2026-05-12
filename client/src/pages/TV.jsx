import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";

const socket = io("https://tv-remote-project.onrender.com");

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

      console.log("LINK RECEIVED:", receivedLink);

      let finalLink = receivedLink.trim();

      // Add https:// automatically
      if (
        !finalLink.startsWith("http://") &&
        !finalLink.startsWith("https://")
      ) {
        finalLink = "https://" + finalLink;
      }

      setLink(finalLink);

      // Open external website
      window.open(finalLink, "_self");

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
        fontFamily: "Arial",
      }}
    >
      <h1>📺 Smart TV</h1>

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
//