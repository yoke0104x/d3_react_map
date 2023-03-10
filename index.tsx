import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const rootElement = document.getElementById('root');
console.log(rootElement);
const root = createRoot(rootElement);

root.render(<App width={600} height={600} />);
