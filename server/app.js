const express = require('express');
const cors = require('cors');

const app = express();
const port = 7700;

// Enable CORS for all routes
app.use(cors());

// Define a sample route
app.get('/', (req, res) => {
  res.send('Hello, this is your Express server with CORS!');
});

app.post('/test', (req, res) => {
    const value = req.body;
    console.log("the received data is ", value);
    res.status(200).send({message:"post successfull", key:1})
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
