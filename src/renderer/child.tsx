import { createRoot } from 'react-dom/client';
import AddCommand from './AddCommand';

const container = document.getElementById('rooty')!;
const root = createRoot(container);
root.render(<AddCommand />);
