import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "API para gerenciamento de tarefas com autenticação JWT"
    },

    servers: [
      {
        url: "http://192.168.1.113:3333",
        description: "Servidor de desenvolvimento"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"]
});
