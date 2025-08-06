import http from 'http';
import App from './app.';

const appInstance = new App();
const app = appInstance.getApp();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
