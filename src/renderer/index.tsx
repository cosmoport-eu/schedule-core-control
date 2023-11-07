import { createRoot } from 'react-dom/client';
import App from './containers/App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

window.electron.ipcRenderer.sendMessage('resources');
window.electron.ipcRenderer.on('resources', (resources) => {
	root.render(<App audio={resources.audio} conf={resources.config} />);
});
