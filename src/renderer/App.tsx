import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './App.css';

const { ipcRenderer } = window.electron;

const Hello = () => {
  const [commands, setCommands] = useState([{ command: 'command one' }]);

  useEffect((): any => {
    ipcRenderer.sendMessage('data-fetcher', ['ping']);

    ipcRenderer.on('data-fetcher', (commandData: Array) => {
      setCommands(commandData);
    });
  }, []);

  return (
    <div>
      <h1>McFly</h1>
      <button
        onClick={() => {
          ipcRenderer.sendMessage('data-fetcher', ['ping']);
        }}
      >
        Get commands!
      </button>
      <div className="Hello">
        <ul>
          {commands.map((cmd) => (
            <li>{cmd.command}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
