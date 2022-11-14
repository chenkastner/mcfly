import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
      <div className="Hello">
        <List>
        {
          commands.map((cmd) => (
            <ListItem button onClick={() =>  navigator.clipboard.writeText(cmd.command)}>
              <ListItemText primary={cmd.command} />
            </ListItem>
        ))
        }
        </List>
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
