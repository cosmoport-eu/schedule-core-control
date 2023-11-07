import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import App from '../renderer/containers/App';

global.fetch = jest.fn(() =>
	Promise.resolve({
		ok: true,
		json: () => Promise.resolve({}),
	}),
) as jest.Mock;

describe('App', () => {
	const audio = {
		dir: '',
		mp3s: [],
	};
	const config = {
		address: { server: '127.0.0.1', ws: '127.0.0.1' },
	};

	it('should render', async () => {
		await waitFor(() => {
			expect(render(<App conf={config} audio={audio} />)).toBeTruthy();
		});
	});
});
