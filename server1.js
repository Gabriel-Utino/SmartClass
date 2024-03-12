const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smartclass"
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conexão ao banco de dados MySQL estabelecida!");
  }
});

app.get("/professores", (req, res) => {
  connection.query("SELECT * FROM Professores", (err, results) => {
    if (err) {
      res.status(500).json({ message: "Erro ao buscar professores no banco de dados" });
    } else {
      res.json(results);
    }
  });
});

app.get("/professores/:id", (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM Professores WHERE Id_prof = ?", [id], (err, results) => {
    if (err) {
      res.status(500).json({ message: "Erro ao buscar o professor no banco de dados" });
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: "Professor não encontrado" });
      }
    }
  });
});

app.post("/professores", (req, res) => {
  const { Nome, Email_constitucional, Materia_Lecionada, CPF, Telefone, Data_Nascimento, Email_pessoal, Endereco_Completo } = req.body;
  const insertQuery = "INSERT INTO Professores (Nome, Email_constitucional, Materia_Lecionada, CPF, Telefone, Data_Nascimento, Email_pessoal, Endereco_Completo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(insertQuery, [Nome, Email_constitucional, Materia_Lecionada, CPF, Telefone, Data_Nascimento, Email_pessoal, Endereco_Completo], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Erro ao adicionar um novo professor" });
    } else {
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  });
});

app.put("/professores/:professor_id", (req, res) => {
  const professor_id = parseInt(req.params.professor_id);
  const updatedProfessor = req.body;

  if (Object.keys(updatedProfessor).length === 0) {
    return res.status(400).json({ message: "Nenhum campo enviado para atualização" });
  }

  const fieldsToUpdate = Object.keys(updatedProfessor);
  const valuesToUpdate = Object.values(updatedProfessor);

  let updateQuery = "UPDATE Professores SET ";
  fieldsToUpdate.forEach((field, index) => {
    updateQuery += `${field} = ?`;
    if (index !== fieldsToUpdate.length - 1) {
      updateQuery += ", ";
    }
  });
  updateQuery += " WHERE Id_prof = ?";

  valuesToUpdate.push(professor_id);

  connection.query(
    updateQuery,
    valuesToUpdate,
    (err, result) => {
      if (err) {
        console.error("Erro ao atualizar dados no MySQL: " + err);
        res.status(500).json({ message: "Erro ao atualizar o professor" });
      } else {
        if (result.affectedRows > 0) {
          res.json({ id: professor_id, updatedFields: fieldsToUpdate });
        } else {
          res.status(404).json({ message: "Professor não encontrado" });
        }
      }
    }
  );
});

app.delete("/professores/:id", (req, res) => {
  const id = req.params.id;
  const deleteQuery = "DELETE FROM Professores WHERE Id_prof = ?";
  connection.query(deleteQuery, [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Erro ao remover o professor" });
    } else {
      if (result.affectedRows > 0) {
        res.json({ message: "Professor removido com sucesso" });
      } else {
        res.status(404).json({ message: "Professor não encontrado" });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
