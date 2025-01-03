import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';

dotenv.config({
  path: '.env',
});

const doc = {
  info: {
    title: 'Task Management',
    description: 'A Task Management project with authentication.',
    version: '0.0.1',
  },
  host: `localhost:${process.env.PORT}`,
};

const outputFile = './swagger-output.json'; // Generated file
const endpointsFiles = ['./src/routes/index.ts']; // Entry point for routes

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  console.log('Swagger documentation generated!');
});
