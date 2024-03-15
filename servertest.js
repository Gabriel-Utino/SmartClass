const express = require('express')
const cors = require('cors')
const mysql = require('mysql')

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

// MySQL接続設定
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smartclass'
})

connection.connect(err => {
  if (err) {
    console.error('MySQL connection failed: ' + err.stack)
    return
  }
  console.log('Connected to MySQL database')
})

// 商品の配列をMySQLから読み込む　ここからDisciplinaの文
let disciplinas = []

connection.query('SELECT d.id_disciplina, d.disciplina, p.nome as id_prof FROM disciplina d join professor p on d.id_prof = p.id_prof;', (err, results) => {
  if (err) {
    console.error('Error fetching data from MySQL: ' + err)
  } else {
    disciplinas = results
  }
})

// すべての商品をリストするためのルート
app.get('/disciplinas', (req, res) => {
  res.json(disciplinas)
})

// IDによって商品を取得するためのルート
app.get('/disciplinas/:id_disciplina', (req, res) => {
  const id_disciplina = parseInt(req.params.id_disciplina)
  const materia = disciplinas.find(materia => materia.id_disciplina === id_disciplina)
  if (materia) {
    res.json(materia)
  } else {
    res.status(404).json({ message: '商品が見つかりません' })
  }
})

// 新しい商品を追加するためのルート
app.post('/disciplinas', (req, res) => {
  const newmateria = req.body
  connection.query(
    'INSERT INTO disciplina (id_disciplina, disciplina, id_prof) VALUES (?, ?, ?)',
    [newmateria.id_disciplina, newmateria.disciplina, newmateria.id_prof],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          res.status(400).json({ message: '指定された教授が存在しません。' })
        } else {
          res.status(500).json({ message: '商品を追加できませんでした' })
        }
      } else {
        newmateria.id_disciplina = result.insertId
        disciplinas.push(newmateria)
        res.status(201).json(newmateria)
      }
    }
  )
})

// 商品を更新するためのルート
app.put('/disciplinas/:id_disciplina', (req, res) => {
  const id_disciplina = parseInt(req.params.id_disciplina)
  const updatedmateria = req.body
  const index = disciplinas.findIndex(disciplinas => disciplinas.id_disciplina === id_disciplina)
  if (index !== -1) {
    connection.query(
      'UPDATE disciplina SET disciplina=?, id_prof=? WHERE id_disciplina=?',
      [updatedmateria.disciplina, updatedmateria.id_prof, id_disciplina],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: '商品を更新できませんでした' })
        } else {
          disciplinas[index] = { ...disciplinas[index], ...updatedmateria }
          res.json(disciplinas[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: '商品が見つかりません' })
  }
})

// 商品を削除するためのルート
app.delete('/disciplinas/:id_discpilina', (req, res) => {
  const id_disciplina = parseInt(req.params.id_discpilina)
  const index = disciplinas.findIndex(materia => materia.id_disciplina === id_disciplina)
  if (index !== -1) {
    connection.query('DELETE FROM disciplina WHERE id_disciplina=?', [id_disciplina], err => {
      if (err) {
        console.error('Error deleting data from MySQL: ' + err)
        res.status(500).json({ message: '商品を削除できませんでした' })
      } else {
        const removedmateria = disciplinas.splice(index, 1)
        res.json(removedmateria[0])
      }
    })
  } else {
    res.status(404).json({ message: '商品が見つかりません' })
  }
})






//ここからはProfessoresのバックエンド
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
  console.log(`ポート${port}でサーバーが開始されました / Servidor iniciado na porta ${port}`)
})
