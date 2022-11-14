import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SearchBar from 'material-ui-search-bar';
import './App.css';
import { CommandEntry } from '../main/dataParser';

const { ipcRenderer } = window.electron;

const McFly = () => {
  const [commands, setCommands] = useState([]);
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect((): any => {
    const filtered = commands.filter((entry: CommandEntry) => {
      const regex = new RegExp(`${searchQuery}`, 'gi');
      return entry.command.match(regex) || entry.description.match(regex);
    });
    setFilteredCommands(filtered);
  }, [searchQuery]);

  useEffect((): any => {
    ipcRenderer.sendMessage('data-fetcher', ['ping']);

    ipcRenderer.on('data-fetcher', (commandData: Array) => {
      setCommands(commandData);
      setFilteredCommands(commandData);
    });
  }, []);

  return (
    <div>
      <h1>McFly</h1>
      <SearchBar
        value={searchQuery}
        onChange={(newValue) => setSearchQuery(newValue)}
      />
      <div className="Hello">
        <List>
          {filteredCommands.map((cmd: CommandEntry) => (
            <ListItem
              button
              onClick={() => navigator.clipboard.writeText(cmd.command)}>
              <ListItemText primary={cmd.command} />
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<McFly />} />
      </Routes>
    </Router>
  );
}
