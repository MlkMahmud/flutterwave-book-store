import express from 'express';

const port = process.env.PORT;
const app = express();


app.get('*', (req, res) => {
  res.status(200).send('What it do, baybeeee!!!!');
});


app.listen(port, () => console.log(`Running on port ${port}`));
