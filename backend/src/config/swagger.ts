import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API do Jogo da Velha",
        version: "1.0.0",
        description: "Documentação da API com Swagger + TypeScript",
      },
      servers: [
        {
          url: "http://localhost:5000",
        },
      ],
    },
    // Caminhos para os arquivos que contêm as anotações
    apis: ["./src/routes/*.ts", "./src/app.ts"], 
  };

  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  console.log("📘 Swagger disponível em: http://localhost:5000/api-docs")
}
