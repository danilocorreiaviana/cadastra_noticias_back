const path = require('path');
const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.json())
app.use(cors());

// Conectar ao MongoDB
// mongoose.connect('mongodb+srv://escoladeempreendedores:<BGm1Jka3kJt2yycg>@cluster0.avc9y2i.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;

try{
  mongoose.connect(process.env.DB_CONCT);
  console.log('Conexão com o mongoDB estabelecida com sucesso!')
}catch(erro){
  console.log('Erro na conexão com o banco :(');
  console.log(erro);
}


// Definir o esquema dos dados
const dataSchema = new mongoose.Schema({
  titulo: String,
  fonte: String,
  foto: String,
  pdf: String,
  link: String
});

// Criar um modelo com base no esquema
const Data = mongoose.model('Data', dataSchema);

// Rota para obter todos os dados
app.get('/api/data', async (req, res) => {
  try {
    const allData = await Data.find();
    res.json(allData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para adicionar dados
app.post('/api/data', async (req, res) => {
  const newData = new Data(req.body);
  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/data/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedData = await Data.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({ message: 'Notícia não encontrada.' });
    }
    res.json({ message: 'Notícia removida com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Página raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
