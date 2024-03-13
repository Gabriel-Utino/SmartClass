const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// MySQL接続設定
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smartclasstest'
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

// 商品の配列をMySQLから読み込む
let disciplinas = [];

connection.query("SELECT * FROM disciplina", (err, results) => {
  if (err) {
    console.error("Error fetching data from MySQL: " + err);
  } else {
    disciplinas = results;
  }
});

// すべての商品をリストするためのルート
app.get("/disciplinas", (req, res) => {
  res.json(disciplinas);
});

// IDによって商品を取得するためのルート
app.get("/disciplinas/:subject_id", (req, res) => {
  const subjectID = parseInt(req.params.subject_id);
  const materia = disciplinas.find((materia) => materia.subject_id === subjectID);
  if (materia) {
    res.json(materia);
  } else {
    res.status(404).json({ message: "商品が見つかりません" });
  }
});

// 新しい商品を追加するためのルート
app.post("/disciplinas", (req, res) => {
  const newmateria = req.body;
  connection.query(
    "INSERT INTO materia (id_discplina, disciplina, id_prof) VALUES (?, ?, ?)",
    [newmateria.id_discplina, newmateria.disciplina, newmateria.id_prof],
    (err, result) => {
      if (err) {
        console.error("Error adding data to MySQL: " + err);
        res.status(500).json({ message: "商品を追加できませんでした" });
      } else {
        newmateria.id_discplina = result.insertId;
        disciplinas.push(newmateria);
        res.status(201).json(newmateria);
      }
    }
  );
});

// 商品を更新するためのルート
app.put("/disciplinas/:id_discplina", (req, res) => {
  const id_discplina = parseInt(req.params.id_discplina);
  const updatedmateria = req.body;
  const index = disciplinas.findIndex((materia) => materia.id_discplina === id_discplina);
  if (index !== -1) {

    connection.query(
      "UPDATE materia SET disciplina=?, id_prof=?WHERE id_discplina=?",
      [updatedmateria.disciplina, updatedmateria.id_prof, id_discplina],
      (err) => {
        if (err) {
          console.error("Error updating data in MySQL: " + err);
          res.status(500).json({ message: "商品を更新できませんでした" });
        } else {
            disciplinas[index] = { ...disciplinas[index], ...updatedmateria };
          res.json(disciplinas[index]);
        }
      }
    );

  } else {
    res.status(404).json({ message: "商品が見つかりません" });
  }
});

// 商品を削除するためのルート
app.delete("/disciplinas/:id_discplina", (req, res) => {
  const id_discplina = parseInt(req.params.id_discplina);
  const index = disciplinas.findIndex((materia) => materia.id_discplina === id_discplina);
  if (index !== -1) {
    connection.query("DELETE FROM materia WHERE id_discplina=?", [id_discplina], (err) => {
      if (err) {
        console.error("Error deleting data from MySQL: " + err);
        res.status(500).json({ message: "商品を削除できませんでした" });
      } else {
        const removedmateria = disciplinas.splice(index, 1);
        res.json(removedmateria[0]);
      }
    });
  } else {
    res.status(404).json({ message: "商品が見つかりません" });
  }
});

app.listen(port, () => {
  console.log(`ポート${port}でサーバーが開始されました`);
});