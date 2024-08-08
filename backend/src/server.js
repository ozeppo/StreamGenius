const app = require('./app');
const mongoose = require('mongoose');
const { mongoURI, port } = require('./config');

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
