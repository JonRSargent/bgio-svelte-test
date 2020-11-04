import App from './App.svelte';

let appDiv = document.createElement('div');
document.body.appendChild(appDiv);
const app = new App({
	target: appDiv,
	props: {
		nbPlayers: 2
	}
});

export default app;