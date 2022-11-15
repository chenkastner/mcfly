import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SearchBar from 'material-ui-search-bar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import './App.css';
import { CommandEntry } from '../main/dataParser';
import ScrollableTabsButton from './Tabs';
import AddCommand from './AddCommand';

const { ipcRenderer } = window.electron;

const TOP_COMMANDS_LENGTH = 2;

const McFly = () => {
  const [commands, setCommands] = useState([]);
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [categorized, setCategorized] = useState({});
  const [frequentCommands, setFrequentCommands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [command, setCommand] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

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
      setCommands(commandData.all_commands);
      setFilteredCommands(commandData.all_commands);
      setCategorized(commandData.categorized);
      const sorted = commandData.categorized.frequent.slice(
        0,
        TOP_COMMANDS_LENGTH
      );
      setFrequentCommands(sorted);
    });

    ipcRenderer.on('add-command', () => {
      ipcRenderer.sendMessage('data-fetcher', ['ping']);
    });
  }, []);

  const onAddButtonClick = () => {
    setIsOpen(true);
  };

  const onAddButtonSubmit = () => {
    const commandData = {
      command,
      description,
      category,
    };
    ipcRenderer.sendMessage('add-command', commandData);
    setIsOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };


  return (
    <div>
      <h1>
        McFly <span role="img"> 👟</span>
      </h1>
      <Modal open={modalIsOpen} className="Modal">
        <div className="modalBody">
          <TextField
            required
            id="outlined-basic"
            onChange={(event) => {
              const { value } = event.target;
              setDescription(value);
            }}
            defaultValue=""
            label="Description"
          />
          <TextField
            required
            id="outlined-basic"
            onChange={(event) => {
              const { value } = event.target;
              setCommand(value);
            }}
            defaultValue=""
            label="Command"
          />
          <TextField
            required
            id="outlined-basic"
            onChange={(event) => {
              const { value } = event.target;
              setCategory(value);
            }}
            defaultValue=""
            label="Category"
          />
          <Button
            className="modalAddButton"
            variant="contained"
            onClick={onAddButtonSubmit}
          >
            Add command
          </Button>
        </div>
      </Modal>
      <div className="headerLine">
        <TextField
          id="searchBar"
          label="Search..."
          type="search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          autoFocus={true}
          />
        <IconButton
          color="primary"
          style={{ fontSize: 50, marginRight: 3 }}
          onClick={onAddButtonClick}
        >
          <AddRoundedIcon />
        </IconButton>
      </div>
      <div className="tabs">
        {searchQuery.length === 0 && Object.keys(categorized).length > 0 && (
          <ScrollableTabsButton
            commandsByCategory={categorized}
            frequentCommands={frequentCommands}
          />
        )}
      </div>
      {searchQuery.length > 0 && (
        <div>
          <List>
            {filteredCommands.map((cmd: CommandEntry) => (
              <ListItem
                button
                onClick={() => {
                  navigator.clipboard.writeText(cmd.command);
                  console.log('Minimizing window after command selection');
                  ipcRenderer.sendMessage('minimize-on-copy', ['ping']);
                }}
              >
                <ListItemText primary={cmd.command} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/add" component={AddCommand} />
        <Route path="/" element={<McFly />} />
      </Routes>
    </Router>
  );
}
