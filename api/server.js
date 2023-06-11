const express = require('express');
const app = express();
const authRoute = require('./routers/auth');
const cors = require('cors');

require('dotenv').config();

const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));