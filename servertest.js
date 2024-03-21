const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
// 
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

// 商品の配列をMySQLから読み込む
let turmas = []
let disciplinas = []
let professores = []


// ここからはTurmaのサーバー管理に関わる部分 turma
connection.query('SELECT * FROM turma;', (err, results) => {
  if (err) {
    console.error('Error fetching data from MySQL: ' + err)
  } else {
    turmas = results
  }
})
// すべての商品をリストするためのルート turma
app.get('/turmas', (req, res) => {
  res.json(turmas)
})
// IDによって商品を取得するためのルート turma
app.get('/turmas/:id_turma', (req, res) => {
  const turmaID = parseInt(req.params.id_turma)
  const turma = turmas.find((turma) => turma.id_turma === turmaID)
  if (turma) {
    res.json(turma)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 新しい商品を追加するためのルート turma
app.post('/turmas', (req, res) => {
  const newTurmas = req.body
  connection.query(
    'INSERT INTO turma (nome_turma) VALUES (?)',
    [newTurmas.nome_turma],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          res.status(400).json({ message: '存在しません。' })
        } else {
          res.status(500).json({ message: 'Turmaを追加できませんでした' })
        }
      } else {
        newTurmas.id_turma = result.insertId
        turmas.push(newTurmas)
        res.status(201).json(newTurmas)
      }
    }
  )
})
// 商品を更新するためのルート turma
app.put("/turmas/:id_turma", (req, res) => {
  const id_turma = parseInt(req.params.id_turma);
  const updatedturma= req.body;
  const index = turmas.findIndex((turma) => turma.id_turma === id_turma);
  if (index !== -1) {

    connection.query(
      "UPDATE turma SET name_turma=? WHERE id_turma=?",
      [updatedturma.name_turma, id_turma],
      (err) => {
        if (err) {
          console.error("Error updating data in MySQL: " + err);
          res.status(500).json({ message: "商品を更新できませんでした" });
        } else {
          turmas[index] = { ...turmas[index], ...updatedturma };
          res.json(turmas[index]);
        }
      }
    );

  } else {
    res.status(404).json({ message: "商品が見つかりません" });
  }
});




connection.query('SELECT d.id_disciplina, d.disciplina, p.nome as id_prof FROM disciplina d join professor p on d.id_prof = p.id_prof;', (err, results) => {
  if (err) {
    console.error('Error fetching data from MySQL: ' + err)
  } else {
    disciplinas = results
  }
})
// すべての商品をリストするためのルート Disciplinas
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
// 先にProfessoresテーブルを投げる必要がある
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
connection.query('SELECT * from professor;', (err, results) => {
  if (err) {
    console.error('Error fetching data from MySQL: ' + err)
  } else {
    professores = results
  }
})
app.get("/professores", (req, res) => {
  connection.query("SELECT * FROM professor", (err, results) => {
    if (err) {
      res.status(500).json({ message: "Erro ao buscar professores no banco de dados" });
    } else {
      res.json(results);
    }
  });
});
// 引き抜き
app.get("/professores/:id", (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM Professor WHERE Id_prof = ?", [id], (err, results) => {
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
//追加
/* 
app.post("/professores", (req, res) => {
  const { Nome, Email_constitucional, Materia_Lecionada, CPF, Telefone, Data_Nascimento, Email_pessoal, Endereco_Completo } = req.body;
  const insertQuery = "INSERT INTO Professor (Nome, Email_constitucional, Materia_Leci, CPF, Telefone, data_de_nascimento, Email_pess, Endereco_Completo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(insertQuery, [Nome, Email_constitucional, Materia_Lecionada, CPF, Telefone, Data_Nascimento, Email_pessoal, Endereco_Completo], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Erro ao adicionar um novo professor" });
    } else {
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  });
}); */
app.post('/professores', (req, res) => {
  const newProfessor = req.body
  connection.query(
    "INSERT INTO Professor (nome, email_prof, Materia_Leci, CPF, Telefone, data_de_nascimento, Email_pass, Endereco_prof) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [newProfessor.Nome, newProfessor.Email_prof, newProfessor.Materia_Lecionada,
      newProfessor.CPF, newProfessor.Telefone, newProfessor.Data_Nascimento,
      newProfessor.Email_pessoal, newProfessor.Endereco_Completo],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          res.status(400).json({ message: '指定された教授が存在しません。' })
        } else {
          res.status(500).json({ message: '商品を追加できませんでした' })
        }
      } else {
        newmateria.id_prof  = result.insertId
        disciplinas.push(newmateria)
        res.status(201).json(newmateria)
      }
    }
  )
})
//更新
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
