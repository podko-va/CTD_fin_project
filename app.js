require('dotenv').config();
require('express-async-errors');

//protection
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');
const app = express();
const authenticateUser = require('./middleware/authentication');

//connectDB
const connectDB = require('./db/connect')
//routers
const authRouter = require('./routes/auth')
const AppointmentsRouter = require('./routes/appointment')
const AdminRouter = require('./routes/admin')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

/*app.get('/', (req, res) => {

  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});*/
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(express.static("public"));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});
// extra packages

// routes
// app.post('/api/v1/auth/register', (req, res) => {
//   res.send('register user');
// });

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/appointments', authenticateUser, AppointmentsRouter)
app.use('/api/v1/admin', AdminRouter)


// app.get('/', (req, res) => {
//    res.send('jobs api');
//  });

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    
    let url = process.env.MONGO_URI;
    // if (process.env.NODE_ENV == "test") {
    //   url = process.env.MONGO_URI_TEST;
    // }
    console.log("process.env.NODE_ENV",process.env.NODE_ENV);
    await connectDB(url);
    
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
    
  } catch (error) {
    console.log(error);
  }
};
module.exports = app;
//if (process.env.NODE_ENV !== 'test') {
  start();
//}


