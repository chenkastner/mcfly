import React, { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import './App.css';
import { CommandEntry } from '../main/dataParser';
const { ipcRenderer } = window.electron;


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  commands_by_category: CommandEntry[];
}


function TabPanel(props: TabPanelProps) {
  const {value, index, commands_by_category, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          {/* This is the tabs content */}
          <List>
          {commands_by_category.map((cmd: CommandEntry) => (
            <ListItem
              button
              onClick={() => {
                navigator.clipboard.writeText(cmd.command);
                ipcRenderer.sendMessage('minimize-on-copy', ['ping']);
              }}>
              <ListItemText primary={cmd.command}/>
            </ListItem>
          ))}
        </List>
        </div>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // flexGrow: 1,
    // width: '100%',
    // backgroundColor: theme.palette.background.paper,
  },
}));



export default function ScrollableTabsButton(props: any) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const {commandsByCategory, frequentCommands} = props;
  const categories: string[] = Object.keys(commandsByCategory).sort();
  const rebuiltCategories = [
    ...categories.filter((category) => category == "all" || category == "frequent"),
    ...categories.filter((category) => category != "all" && category != "frequent")
  ];
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
         {rebuiltCategories && rebuiltCategories.map((label: string, i: number) => {
            return ( <Tab  label={label}/>);
          })}
        </Tabs>
      </AppBar>
          {rebuiltCategories && rebuiltCategories.map((category: string, index:number) => {
            return (<TabPanel value={value} index={index} commands_by_category={commandsByCategory[category]}></TabPanel>);
          })}
    </div>
  );
}

