import express from 'express';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../swagger-output.json';
const app = express();

app.use(
  express.json({
    limit: '20kb',
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/v1', routes);

// Global error handler
app.use(errorHandler);

export default app;
