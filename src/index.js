import express from 'express';
import cors from 'cors';

import testBDD from './config/testBDD.js';
import initializeRoutes from './config/initializeRoutes.js';

const app = express();
const PORT = process.env.PORT;

if (!PORT) {
	console.error('Error: PORT environment variable is not defined.');
	process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

initializeRoutes(app);

testBDD();

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
