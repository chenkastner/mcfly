import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './AddCommand.css';
import { CommandEntry } from '../main/dataParser';

// const { ipcRenderer } = window.electron;

const AddCommand = () => {
  return (
    <div>
      <h1>
        Add Command <span role="img"> 👟</span>
      </h1>
    </div>
  );
};

export default function App() {
  return (
    <AddCommand />
  );
}
