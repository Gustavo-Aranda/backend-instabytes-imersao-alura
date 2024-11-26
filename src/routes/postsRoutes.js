import express from "express"; // Importa o framework Express para criar a aplicação web
import multer from "multer"; // Importa o módulo Multer para lidar com o upload de arquivos
import cors from "cors";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js"; // Importa as funções controladoras para lidar com as rotas

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
};

// Configura o armazenamento em disco para o Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) { // Define o diretório de destino para os arquivos carregados
    cb(null, 'uploads/'); // Define o diretório como 'uploads/'
  },
  filename: function (req, file, cb) { // Define o nome dos arquivos carregados
    cb(null, file.originalname); // Usa o nome original do arquivo
  }
});

// Cria uma instância do middleware Multer
const upload = multer({ storage: storage });

// Define uma função para registrar as rotas na aplicação Express
const routes = (app) => {
  app.use(express.json()); // Habilita o middleware para analisar o corpo das requisições JSON

  app.use(cors(corsOptions));

  // Rota GET para buscar todos os posts (lida pela função listarPosts)
  app.get("/posts", listarPosts);

  // Rota POST para criar um novo post (lida pela função postarNovoPost)
  app.post("/posts", postarNovoPost);

  // Rota POST para lidar com o upload de imagens usando Multer (usa o middleware upload.single)
  // e processa a imagem carregada (lida pela função uploadImagem)
  app.post("/upload", upload.single("imagem"), uploadImagem);

  app.put("/upload/:id", atualizarNovoPost);
};

// Exporta a função de rotas para ser usada no arquivo principal da aplicação
export default routes;