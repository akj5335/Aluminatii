
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Aluminati API',
            version: '1.0.0',
            description: 'API Documentation for Aluminati Alumni Platform',
            contact: {
                name: 'API Support',
                email: 'support@aluminati.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local Development Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./backend/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
