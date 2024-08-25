import express from 'express';
import { IConfig } from '../app.config';
import { registerV1Routes } from './router';

const app = express();

export async function serve(config: IConfig) {
  const port = config.httpPort;

  app.use(express.json()); // Add this line to enable JSON parsing in the request body

  app.use('/v1', registerV1Routes());

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
