import React, { useState, useEffect } from 'react';
import Editor from './Editor'
import { socket } from '../Socket';
import useLocalStorage from '../hooks/useLocalStorage'
import { io } from 'socket.io-client'; // Import the socket.io-client library



function Finished() {
  const [html, setHtml] = useLocalStorage('html', '')
  const [css, setCss] = useLocalStorage('css', '')
  const [js, setJs] = useLocalStorage('js', '')
  const [srcDoc, setSrcDoc] = useState('')
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);
  useEffect(() => {
    socket.emit('code-update', { html, css, js });
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `)
    }, 250);
  
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  return (
    <>
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
    </>
  )
}

export default Finished;
