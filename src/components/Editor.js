import React, { useState, useEffect} from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import { Controlled as ControlledEditor } from 'react-codemirror2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons'

export default function Editor(props) {
  const {
    language,
    displayName,
    value,
    onChange,
    socket, 
    setHtml,
    setCss,
    setJs,
  } = props;

  const [open, setOpen] = useState(true);
  useEffect(() => {
    socket.on('code-update', (data) => {
      setHtml(data.html);
      setCss(data.css);
      setJs(data.js);
      socket.emit('code-update', { ...data});
      console.log('updaten');
    });
    // const { html, css, js } = props; 

  }, []);

  // Handle code changes when a user interacts with the editor
  function handleChange(editor, data, value) {
    onChange(value);
   
    const { html, css, js } = props; 
    // Emit code changes to be shared with other connected clients
    socket.emit('code-update', { html, css, js });
  }
  useEffect(() => {
    socket.on('refresh-page', () => {
      // Refresh the page when a refresh event is received
      window.location.reload();
    });
  }, []);

  return (
    <div className={`editor-container ${open ? '' : 'collapsed'}`}>
      <div className="editor-title">
        {displayName}
        <button
          type="button"
          className="expand-collapse-btn"
          onClick={() => setOpen(prevOpen => !prevOpen)}
        >
          <FontAwesomeIcon icon={open ? faCompressAlt : faExpandAlt} />
        </button>
      </div>
      <ControlledEditor
        onBeforeChange={handleChange}
        value={value}
        className="code-mirror-wrapper"
        socket={socket}
        options={{
          lineWrapping: true,
          lint: true,
          mode: language,
          theme: 'material',
          lineNumbers: true
        }}
      />
    </div>
  )
}
