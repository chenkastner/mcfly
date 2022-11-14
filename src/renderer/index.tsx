import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
// window.electron.ipcRenderer.on('data-fetcher', (commandData) => {
//   // eslint-disable-next-line no-console
//   console.log(commandData);
// });

// window.electron.ipcRenderer.sendMessage('data-fetcher', ['ping']);
