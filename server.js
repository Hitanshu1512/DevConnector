const express = require('express');

const app = express();

app.get('/', (req, res) => res.send("API IS RUNNING SUCCESSFULLY!"));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server started ar port ${PORT}`));

