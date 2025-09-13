import express from 'express';
import { userRouter } from './routes/users.js';
import { imageRouter } from './routes/images.js';


const app = express();
const port = 3000;

app.use(express.json());
app.use('/', userRouter);
app.use('/images', imageRouter);

app.get('/', (req, res) => {
    res.send("Hello world!");
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})