import React, { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import './App.css';
import { CommandEntry } from '../main/dataParser';


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
        <Box p={3}>
          {/* This is the tabs content */}
          <List>
          {commands_by_category.map((cmd: CommandEntry) => (
            <ListItem
              button
              onClick={() => navigator.clipboard.writeText(cmd.command)}>
              <ListItemText primary={cmd.command} />
            </ListItem>
          ))}
        </List>
        </Box>
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
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));



export default function ScrollableTabsButtonAuto(props: any) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const {commandsByCategory} = props;
  debugger;
  const categories: string[] = Object.keys(commandsByCategory);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const TabsArray = ({labels}: {labels: string[]}) => {
    console.log(labels);
    return (
      <div>
          {labels && labels.map((label: string, i: number) => {
            return ( <Tab label={label} {...a11yProps(i)}/>);
          })}
      </div>
    );
  }

  const TabsPanelArr = ({categories}: {categories: string[]}) => {
    return (
      <div>
          {categories && categories.map((category: string, index:number) => {
            return (<TabPanel value={value} index={index} commands_by_category={commandsByCategory[category]}></TabPanel>);
          })}
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <TabsArray labels={categories}/>
        </Tabs>
      </AppBar>
      <TabsPanelArr categories={categories}/>
    </div>
  );
}