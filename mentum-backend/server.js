const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', require('./routes/auth'));
app.use('/resources', require('./routes/resources'));
app.use('/profile', require('./routes/profile'));
app.use('/mentors', require('./routes/mentors'));
app.use('/user-profile', require('./routes/userProfile'));

app.use(authMiddleware);

app.use('/graphql', graphqlHTTP((req) => ({
  schema,
  context: { user: req.user },
  graphiql: true,
})));

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
