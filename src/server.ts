import { config } from 'dotenv';
import {
  createServer as createHttpServer,
  request as httpRequest,
  Server,
} from 'http';
import cluster, { Worker } from 'cluster';
import { cpus } from 'os';
import { requestListener } from './router/router';

config();

const host = process.env.HOST;
const port = Number(process.env.PORT);
const isMultiMode = process.env.build === 'multi';

const createChildWorker = (i: number): Worker => {
  const childWorker = cluster.fork({ HOST: host, PORT: port + i });

  childWorker.on('message', (data) => {
    Object.values(cluster.workers || {}).forEach((worker) =>
      worker?.send(data)
    );
  });

  return childWorker;
};

const setupMultiModeServer = (): Server => {
  const numCpus = cpus().length;

  Array.from({ length: numCpus }, (_, i) => createChildWorker(i + 1));

  cluster.on('exit', (worker, code) => {
    console.log(`Worker ${worker.id} finished. Exit code: ${code}`);
  });

  let currentPortIndex = 0;

  return createHttpServer(async (request, response) => {
    const childPort = port + (++currentPortIndex % numCpus) + 1;

    const options = {
      hostname: host,
      port: childPort,
      path: request.url,
      method: request.method,
      headers: request.headers,
    };

    const requestToChildProcess = httpRequest(
      options,
      (responseFromChildProcess) => {
        response.statusCode = responseFromChildProcess.statusCode || 500;
        responseFromChildProcess.pipe(response, { end: true });
      }
    );

    request.pipe(requestToChildProcess, { end: true });
  });
};

const createServer = (): Server => {
  if (cluster.isPrimary && isMultiMode) {
    const multiModeServer = setupMultiModeServer();
    multiModeServer.listen(port, host, () => {
      console.log(`Multi server running at http://${host}:${port}/`);
    });
    return multiModeServer;
  } else {
    const server = createHttpServer(requestListener);
    server.listen(port, host, () => {
      console.log(`Server running at http://${host}:${port}/`);
    });
    return server;
  }
};

const server = createServer();

export default server;
