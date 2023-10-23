import React, { useState, useEffect } from "react";
import Editor from "./Editor";
import { socket } from "../Socket";
import useLocalStorage from "../hooks/useLocalStorage";
import { io } from "socket.io-client"; // Import the socket.io-client library

import Call from "./Call";

function App() {
  const [open, setOpen] = useState(true);
  const [html, setHtml] = useLocalStorage("html", "");
  const [css, setCss] = useLocalStorage("css", "");
  const [js, setJs] = useLocalStorage("js", "");
  const [srcDoc, setSrcDoc] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [showCall, setShowCall] = useState(false);
  useEffect(() => {
    socket.emit("code-update", { html, css, js });
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `);
    }, 150);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  useEffect(() => {
    socket.on("refresh-page", () => {
      // Refresh the page when a refresh event is received
      window.location.reload();
    });
  }, []);



  return (
    <>
      <div className="cont">
        <div className="flex-cont">
          <button
            className="call-btn"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
          >
            <div className="nav">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
            </div>
          </button>
          {open && <Call />}

          <div className="pane top-pane">
            <Editor
              language="xml"
              displayName="HTML"
              value={html}
              onChange={setHtml}
              socket={socket}
            />
            <Editor
              language="css"
              displayName="CSS"
              value={css}
              onChange={setCss}
              socket={socket}
            />
            <Editor
              language="javascript"
              displayName="JS"
              value={js}
              onChange={setJs}
              socket={socket}
            />
          </div>
          <div className="pane">
            <iframe
              socket={socket}
              srcDoc={srcDoc}
              title="output"
              sandbox="allow-scripts"
              frameBorder="0"
              width="100%"
              height="100%"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
