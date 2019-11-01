import  Server  from './api-server';
import dotenv from 'dotenv';
dotenv.config();
const server = Server.instance;

server.start();

process.on('SIGTERM', async () => {
	server.gracefulShutdown('SIGTERM').then(() => {
		process.exit(0);
  });
});

process.on('SIGINT', async () => {
	server.gracefulShutdown('SIGINT').then(() => {
		process.exit(0);
  });
});

process.on('SIGHUP', async () => {
	server.gracefulShutdown('SIGHUP').then(() => {
		process.exit(0); 
  });
});

process.once('SIGUSR2', async () => { 
  server.gracefulShutdown('SIGUSR2').then(() => {
    process.kill(process.pid, 'SIGUSR2');
  });
});