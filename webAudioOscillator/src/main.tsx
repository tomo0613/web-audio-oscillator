import { createRoot } from 'react-dom/client';
import { App } from "./app/App";

const container = document.createElement("main");

document.body.appendChild(container);

const root = createRoot(container);

root.render(<App />);
