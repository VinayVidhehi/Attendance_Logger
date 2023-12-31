const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { handleUserLogin, handleUserSignup, attendanceUpdate } = require('./router');

const app = express();
const PORT = 7700;

// Enable CORS
app.use(cors());

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.json());

// MySQL Connection

// Change the route to /attendance
app.get('/attendance', attendanceUpdate);

app.post('/signup', handleUserSignup);
app.post('/login', handleUserLogin);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
