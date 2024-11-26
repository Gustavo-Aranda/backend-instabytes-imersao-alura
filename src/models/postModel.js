import 'dotenv/config';
// Importa a função para conectar ao banco de dados, definida em dbconfig.js
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js"; 
// Conecta ao banco de dados usando a string de conexão fornecida pela variável de ambiente STRING_CONEXAO e armazena a conexão em uma constante
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO); 

export async function getTodosOsPosts(){
    const db = conexao.db("imersao-instabytes-alura"); // Seleciona o banco de dados "imersao-instabytes-alura" dentro da conexão
    const colecao = db.collection("posts"); // Seleciona a coleção "posts" dentro do banco de dados
    return colecao.find().toArray(); // Realiza uma consulta para encontrar todos os documentos (posts) na coleção e retorna os resultados como um array
};

export async function criarPost(novoPost) {
    const db = conexao.db("imersao-instabytes-alura"); 
    const colecao = db.collection("posts"); 
    return colecao.insertOne(novoPost); 
}

export async function atualizarPost(id, novoPost) {
    const db = conexao.db("imersao-instabytes-alura"); 
    const colecao = db.collection("posts");
    const objectId = ObjectId.createFromHexString(id) //pega um id que escrevemos e colocamos no objeto que o mongo obriga
    return colecao.updateOne({_id: new ObjectId(objectId)}, {$set:novoPost}); //o primeiro parametro é um objeto para identificar para o MongoDB qual o id específico que vai dar update, o segundo serve para setar o post que vai atualizar o antigo
}