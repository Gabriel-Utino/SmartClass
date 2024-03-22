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
let alunos = []
let disciplinas = []
let professores = []


// ここからはTurmaのサーバー管理に関わる部分 turma
connection.query('SELECT * FROM turma;', (err, results) => {
  if (err) {
    console.error('Turmaテーブルでエラー発生: ' + err)
  } else {
    turmas = results
  }
})
// リスト化 turma
app.get('/turmas', (req, res) => {
  res.json(turmas)
})
// IDによって取得 turma
app.get('/turmas/:id_turma', (req, res) => {
  const turmaID = parseInt(req.params.id_turma)
  const turma = turmas.find((turma) => turma.id_turma === turmaID)
  if (turma) {
    res.json(turma)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加 turma
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
// 更新 turma
app.put("/turmas/:id_turma", (req, res) => {
  const id_turma = parseInt(req.params.id_turma);
  const updatedturma= req.body;
  const index = turmas.findIndex((turma) => turma.id_turma === id_turma);
  if (index !== -1) {

    connection.query(
      "UPDATE turma SET nome_turma=? WHERE id_turma=?",
      [updatedturma.nome_turma, id_turma],
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




// ここからはAlunoのサーバー管理に関わる部分 alunos
connection.query('SELECT * FROM aluno;', (err, results) => {
  if (err) {
    console.error('Alunoテーブルでエラー発生: ' + err)
  } else {
    alunos = results
  }
})
// リスト化 alunos
app.get('/alunos', (req, res) => {
  res.json(alunos)
})
// IDによって取得 alunos
app.get('/alunos/:id_turma', (req, res) => {
  const alunoID = parseInt(req.params.id_turma)
  const aluno = alunos.find((aluno) => aluno.id_turma === alunoID)
  if (aluno) {
    res.json(aluno)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加 alunos
app.post('/alunos', (req, res) => {
  const newAluno = req.body
  connection.query(
    "INSERT INTO aluno (nome_aluno, ra_aluno, endereco_aluno, telefone_aluno, email_aluno, id_turma, nacimento_aluno) VALUES (?,?,?,?,?,?,?)",
    [newAluno.nome_aluno, newAluno.ra_aluno, newAluno.endereco_aluno , newAluno.telefone_aluno , newAluno.email_aluno , newAluno.id_turma , newAluno.nacimento_aluno],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          res.status(400).json({ message: '存在しません。' })
        } else {
          res.status(500).json({ message: 'alunoを追加できませんでした' })
        }
      } else {
        newAluno.id_aluno = result.insertId
        alunos.push(newAluno)
        res.status(201).json(newAluno)
      }
    }
  )
})
// 更新 alunos
app.put("/alunos/:id_aluno", (req, res) => {
  const id_aluno = parseInt(req.params.id_aluno);
  const updatedAluno = req.body;
  const index = alunos.findIndex((aluno) => aluno.id_aluno === id_aluno);
  if (index !== -1) {
    connection.query(
      "UPDATE aluno SET nome_aluno=?, ra_aluno=?, endereco_aluno=?, telefone_aluno=?, email_aluno=?, id_turma=?, nacimento_aluno=? WHERE id_aluno=?",
      [updatedAluno.nome_aluno, updatedAluno.ra_aluno, updatedAluno.endereco_aluno , updatedAluno.telefone_aluno , updatedAluno.email_aluno , updatedAluno.id_turma , updatedAluno.nacimento_aluno
        , id_aluno],
      (err) => {
        if (err) {
          console.error("Error updating data in MySQL: " + err);
          res.status(500).json({ message: "商品を更新できませんでした" });
        } else {
          alunos[index] = { ...alunos[index], ...updatedAluno };
          res.json(alunos[index]);
        }
      }
    );
  } else {
    res.status(404).json({ message: "商品が見つかりません" });
  }
});





// ここからはDisciplinaのサーバー管理に関わる部分 disciplinas
connection.query('SELECT d.id_disciplina, d.disciplina, p.nome as id_prof FROM disciplina d join professor p on d.id_prof = p.id_prof;', (err, results) => {
  if (err) {
    console.error('Disciplinaテーブルでエラー発生: ' + err)
  } else {
    disciplinas = results
  }
})
// リスト化 disciplinas
app.get('/disciplinas', (req, res) => {
  res.json(disciplinas)
})
// IDによって取得する disciplinas
app.get('/disciplinas/:id_disciplina', (req, res) => {
  const id_disciplina = parseInt(req.params.id_disciplina)
  const materia = disciplinas.find(materia => materia.id_disciplina === id_disciplina)
  if (materia) {
    res.json(materia)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加 disciplinas
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
// 更新 disciplinas
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
// 商品 disciplinas
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





// ここからはProfessorのサーバー管理に関わる部分 Professor
connection.query('SELECT * FROM professor;', (err, results) => {
  if (err) {
    console.error('Professorテーブルでエラー発生: ' + err)
  } else {
    professores = results
  }
})
// リスト化 Professor
app.get('/professores', (req, res) => {
  res.json(professores)
})
// IDによって取得 Professor
app.get('/professores/:id_prof', (req, res) => {
  const professorID = parseInt(req.params.id_prof)
  const professor = professores.find((professor) => professor.id_prof === professorID)
  if (professor) {
    res.json(professor)
  } else {
    res.status(404).json({ message: '見つかりませんでした' })
  }
})
// 追加 Professor
app.post('/professores', (req, res) => {
  const newProfessor = req.body
  connection.query(
    "INSERT INTO professor (nome, email_prof, materia_leci, CPF, telefone, data_de_nascimento, email_pass, endereco_prof) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [newProfessor.nome, newProfessor.email_prof, newProfessor.materia_leci , newProfessor.CPF , newProfessor.telefone , newProfessor.data_de_nascimento , newProfessor.email_pass, newProfessor.endereco_prof],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          res.status(400).json({ message: '存在しません。' })
        } else {
          res.status(500).json({ message: 'Professorを追加できませんでした' })
        }
      } else {
        newProfessor.id_prof = result.insertId
        professores.push(newProfessor)
        res.status(201).json(newProfessor)
      }
    }
  )
})
// 更新 Professor
app.put("/professores/:id_prof", (req, res) => {
  const id_prof = parseInt(req.params.id_prof);
  const updatedProf = req.body;
  const index = professores.findIndex((professor) => professor.id_prof === id_prof);
  if (index !== -1) {
    connection.query(
      "UPDATE professor SET nome=?, email_prof=?, materia_leci=?, CPF=?, telefone=?, data_de_nascimento=?, email_pass=?, endereco_prof=? WHERE id_prof=?",
      [updatedProf.nome, updatedProf.email_prof, updatedProf.materia_leci , updatedProf.CPF, updatedProf.telefone, updatedProf.data_de_nascimento, updatedProf.email_pass, updatedProf.endereco_prof, id_prof],
      (err) => {
        if (err) {
          console.error("Table professor - Error updating data in MySQL: " + err);
          res.status(500).json({ message: "更新できませんでした" });
        } else {
          professores[index] = { ...professores[index], ...updatedProf };
          res.json(professores[index]);
        }
      }
    );
  } else {
    res.status(404).json({ message: "商品が見つかりません" });
  }
});





// ここからはProfessorのサーバー管理に関わる部分 Professor
connection.query('SELECT * FROM professor;', (err, results) => {
  if (err) {
    console.error('Professorテーブルでエラー発生: ' + err)
  } else {
    professores = results
  }
})
// リスト化 Professor
app.get('/professores', (req, res) => {
  res.json(professores)
})
// IDによって取得 Professor
app.get('/professores/:id_prof', (req, res) => {
  const professorID = parseInt(req.params.id_prof)
  const professor = professores.find((professor) => professor.id_prof === professorID)
  if (professor) {
    res.json(professor)
  } else {
    res.status(404).json({ message: '見つかりませんでした' })
  }
})
// 追加 Professor
app.post('/professores', (req, res) => {
  const newProfessor = req.body
  connection.query(
    "INSERT INTO professor (nome, email_prof, materia_leci, CPF, telefone, data_de_nascimento, email_pass, endereco_prof) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [newProfessor.nome, newProfessor.email_prof, newProfessor.materia_leci , newProfessor.CPF , newProfessor.telefone , newProfessor.data_de_nascimento , newProfessor.email_pass, newProfessor.endereco_prof],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          res.status(400).json({ message: '存在しません。' })
        } else {
          res.status(500).json({ message: 'Professorを追加できませんでした' })
        }
      } else {
        newProfessor.id_prof = result.insertId
        professores.push(newProfessor)
        res.status(201).json(newProfessor)
      }
    }
  )
})
// 更新 Professor
app.put("/professores/:id_prof", (req, res) => {
  const id_prof = parseInt(req.params.id_prof);
  const updatedProf = req.body;
  const index = professores.findIndex((professor) => professor.id_prof === id_prof);
  if (index !== -1) {
    connection.query(
      "UPDATE professor SET nome=?, email_prof=?, materia_leci=?, CPF=?, telefone=?, data_de_nascimento=?, email_pass=?, endereco_prof=? WHERE id_prof=?",
      [updatedProf.nome, updatedProf.email_prof, updatedProf.materia_leci , updatedProf.CPF, updatedProf.telefone, updatedProf.data_de_nascimento, updatedProf.email_pass, updatedProf.endereco_prof, id_prof],
      (err) => {
        if (err) {
          console.error("Table professor - Error updating data in MySQL: " + err);
          res.status(500).json({ message: "更新できませんでした" });
        } else {
          professores[index] = { ...professores[index], ...updatedProf };
          res.json(professores[index]);
        }
      }
    );
  } else {
    res.status(404).json({ message: "商品が見つかりません" });
  }
});



app.listen(port, () => {
  console.log(`ポート${port}でサーバーが開始されました / Servidor iniciado na porta ${port}`)
})
