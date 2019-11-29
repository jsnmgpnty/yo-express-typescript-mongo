import dotenv from 'dotenv';
dotenv.config();

import Server from './common/server';

const port = parseInt(process.env.PORT);
export default new Server().router().listen(port);
