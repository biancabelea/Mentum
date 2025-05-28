const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

app.use(authMiddleware);
app.use('/auth', require('./routes/auth'));
app.use('/resources', require('./routes/resources'));
app.use('/profile', require('./routes/profile'));
app.use('/user-profile', require('./routes/userProfile'));
app.use('/mentors', require('./routes/mentors'));
app.use('/comments', require('./routes/comments'));
app.use('/bookings', require('./routes/bookings'));
app.use('/availability', require('./routes/availability'));

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: req.user }),
  });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();