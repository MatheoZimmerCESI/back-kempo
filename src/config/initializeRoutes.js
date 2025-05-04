import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

export default function initializeRoutes(app) {
	const __filename = fileURLToPath(import.meta.url);
	const routeDirectory = path.join(path.dirname(__filename), '../routes');

	fs.readdir(routeDirectory, (err, files) => {
		if (err) {
			console.error('Erreur lors de la lecture du dossier routes:', err);
			throw err;
		}

		const routeFiles = files.filter((file) => file.endsWith('.js'));

		routeFiles.forEach((routeFile) => {
			const routePath = pathToFileURL(path.join(routeDirectory, routeFile)).href;

			import(routePath)
				.then((routeModule) => {
					if (routeModule.default) {
						app.use('/', routeModule.default);
						console.log(`Route chargée : /${routeFile.replace('.js', '')}`);
					} else {
						console.error(`Le module ${routeFile} n'a pas d'export par défaut.`);
					}
				})
				.catch((error) => {
					console.error(`Erreur lors du chargement de la route : ${routeFile}`, error);
				});
		});
	});
}
