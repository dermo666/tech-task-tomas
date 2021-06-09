import express from 'express';
import { USERS } from './userLogins';
const app = express()
const port = 3000

app.use(express.json())

app.get('/status', (req, res) => { res.status(200).end(); });
app.head('/status', (req, res) => { res.status(200).end(); });

const basicAuthHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, ...passwordParts] = Buffer.from(b64auth, 'base64').toString().split(':')
  const password = passwordParts.join(':');

  const user = USERS.users.find(row => row.userLogin === login && row.password === password);

  if (!user) {
    res.set('WWW-Authenticate', 'Basic realm="tech-test-3"')
    res.status(401).send('Authentication required')
  }
  
  next()
}

app.get('/basic-auth', basicAuthHandler, (req: express.Request, res: express.Response) => {
  res.status(200).end();
})

export const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})