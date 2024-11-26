import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js"
import { getTodosOsPosts, criarPost, atualizarPost } from "../models/postModel.js";

export async function listarPosts(req, res) { // Define uma rota GET para a URL "/posts"
    const posts = await getTodosOsPosts(); // Chama a função para obter todos os posts do banco de dados
    res.status(200).json(posts); // Envia os posts como resposta em formato JSON com o status HTTP 200 (OK)
};

export async function postarNovoPost(req, res) {
    const novoPost = req.body; //Recebe o conteúdo que deseja criar
    try{
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch (erroPost){
        console.error(erroPost.message);
        res.status(500).json({"Erro": "Falha na requisição."})
    }
};

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt:""
    };
    try{
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada)
        res.status(200).json(postCriado);
    } catch (erroPost){
        console.error(erroPost.message);
        res.status(500).json({"Erro": "Falha na requisição."})
    }
};

export async function atualizarNovoPost(req, res) {
    const id = req.params.id; // id necessário que sera atualizado
    const urlImagem = `http://localhost:3000/${id}.png`;
    try {        
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        };

        const postCriado = await atualizarPost(id, post);

        res.status(200).json(postCriado);
    } catch (erroPost){
        console.error(erroPost.message);
        res.status(500).json({"Erro": "Falha na requisição."});
    };
}