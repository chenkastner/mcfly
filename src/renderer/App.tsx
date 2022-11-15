import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import IconButton from '@material-ui/core/IconButton';
import SearchBar from 'material-ui-search-bar';
import './App.css';
import { CommandEntry } from '../main/dataParser';
import ScrollableTabsButtonAuto from './Tabs';

const { ipcRenderer } = window.electron;

const TOP_COMMANDS_LENGTH = 2;

const McFly = () => {
  const [commands, setCommands] = useState([]);
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [categorized, setCategorized] = useState({});
  const [frequentCommands, setFrequentCommands] = useState([]);
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

    ipcRenderer.on('data-fetcher', (commandData: any) => {
      debugger;
      setCommands(commandData.all_commands);
      setFilteredCommands(commandData.all_commands);
      setCategorized(commandData.categorized);
      const sorted = commandData.categorized.frequent.slice(0, TOP_COMMANDS_LENGTH);
      setFrequentCommands(sorted);
     });
  }, []);

  const onAddButtonClick = () => {
    console.log("Add button clicked")
    ipcRenderer.sendMessage('add-command', ['ping']);
  }

  return (
    <div>
      <h1> McFly <span role="img"> 👟</span></h1>
      <div className="headerLine">
        <SearchBar
          className="searchBar"
          value={searchQuery}
          onChange={(newValue) => setSearchQuery(newValue)}
        />
        <IconButton color="primary" style={{ fontSize: 50, marginRight: 3 }} onClick={onAddButtonClick}>
          <AddRoundedIcon />
        </IconButton>
      </div>

      {/* <div className="Commands">
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Frequently Used
            </ListSubheader>}>
          {frequentCommands.map((cmd: CommandEntry) => (
            <ListItem
              button
              onClick={() => {
                navigator.clipboard.writeText(cmd.command);
                // window.minimize();
              }}>
              <ListItemText primary={cmd.description} secondary={cmd.command} />
            </ListItem>
          ))}
        </List>
      </div> */}
      <div className="Commands">
        {Object.keys(categorized).length > 0 && <ScrollableTabsButtonAuto commandsByCategory={categorized} frequentCommands={frequentCommands}/>}
        {/* <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              All commands
            </ListSubheader>}>
          {filteredCommands.map((cmd: CommandEntry) => (
            <ListItem
              button
              onClick={() => navigator.clipboard.writeText(cmd.command)}>
              <ListItemText primary={cmd.description} secondary={cmd.command} />
            </ListItem>
          ))}
        </List> */}
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
