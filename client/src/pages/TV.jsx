import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";

const socket = io("https://tv-remote-project.onrender.com");

function TV() {

  const roomId = "ROOM123";

  const [mouse, setMouse] = useState({
    x: 200,
    y: 200,
  });

  const [clicked, setClicked] = useState(false);

  useEffect(() => {

    socket.emit("join-room", roomId);

    // Mouse movement
    socket.on("mouse-update", (data) => {

      setMouse({
        x: data.x,
        y: data.y,
      });

    });

    // Mouse click animation
    socket.on("mouse-clicked", () => {

      setClicked(true);

      setTimeout(() => {
        setClicked(false);
      }, 200);

    });

    // Receive link
    socket.on("receive-link", (receivedLink) => {

      let finalLink = receivedLink.trim();

      if (
        !finalLink.startsWith("http://") &&
        !finalLink.startsWith("https://")
      ) {
        finalLink = "https://" + finalLink;
      }

      window.open(finalLink, "_self");

    });

    return () => {

      socket.off("mouse-update");
      socket.off("mouse-clicked");
      socket.off("receive-link");

    };

  }, []);

  const qrValue =
    `${window.location.origin}/remote/${roomId}`;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* Mouse Cursor */}
      <div
        style={{
          position: "absolute",
          left: mouse.x,
          top: mouse.y,
          width: clicked ? "35px" : "20px",
          height: clicked ? "35px" : "20px",
          background: clicked ? "yellow" : "red",
          borderRadius: "50%",
          transition: "0.1s",
        }}
      />

      {/* QR Code */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "white",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        <QRCodeCanvas
          value={qrValue}
          size={150}
        />
      </div>

      <h1
        style={{
          color: "white",
          textAlign: "center",
          paddingTop: "40px",
        }}
      >
        📺 Smart TV Remote
      </h1>

    </div>
  );
}

export default TV;