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
    database: 'materias'
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

// 商品の配列をMySQLから読み込む
let materias = [];

connection.query("SELECT * FROM materia", (err, results) => {
  if (err) {
    console.error("Error fetching data from MySQL: " + err);
  } else {
    materias = results;
  }
});

// すべての商品をリストするためのルート
app.get("/materias", (req, res) => {
  res.json(materias);
});

// IDによって商品を取得するためのルート
app.get("/materias/:subject_id", (req, res) => {
  const subjectID = parseInt(req.params.subject_id);
  const materia = materias.find((materia) => materia.subject_id === subjectID);
  if (materia) {
    res.json(materia);
  } else {
    res.status(404).json({ message: "商品が見つかりません" });
  }
});

// 新しい商品を追加するためのルート
app.post("/materias", (req, res) => {
  const newmateria = req.body;
  connection.query(
    "INSERT INTO materia (subject_id, subject_name, professor_id, credit_hours) VALUES (?, ?, ?, ?)",
    [newmateria.subject_id, newmateria.subject_name, newmateria.professor_id, newmateria.credit_hours],
    (err, result) => {
      if (err) {
        console.error("Error adding data to MySQL: " + err);
        res.status(500).json({ message: "商品を追加できませんでした" });
      } else {
        newmateria.subject_id = result.insertId;
        materias.push(newmateria);
        res.status(201).json(newmateria);
      }
    }
  );
});

// 商品を更新するためのルート
app.put("/materias/:subject_id", (req, res) => {
  const subject_id = parseInt(req.params.subject_id);
  const updatedmateria = req.body;
  const index = materias.findIndex((materia) => materia.subject_id === subject_id);
  if (index !== -1) {

    connection.query(
      "UPDATE materia SET subject_name=?, professor_id=?, credit_hours=? WHERE subject_id=?",
      [updatedmateria.subject_name, updatedmateria.professor_id, updatedmateria.credit_hours, subject_id],
      (err) => {
        if (err) {
          console.error("Error updating data in MySQL: " + err);
          res.status(500).json({ message: "商品を更新できませんでした" });
        } else {
          materias[index] = { ...materias[index], ...updatedmateria };
          res.json(materias[index]);
        }
      }
    );

  } else {
    res.status(404).json({ message: "商品が見つかりません" });
  }
});

// 商品を削除するためのルート
app.delete("/materias/:subject_id", (req, res) => {
  const subject_id = parseInt(req.params.subject_id);
  const index = materias.findIndex((materia) => materia.subject_id === subject_id);
  if (index !== -1) {
    connection.query("DELETE FROM materia WHERE subject_id=?", [subject_id], (err) => {
      if (err) {
        console.error("Error deleting data from MySQL: " + err);
        res.status(500).json({ message: "商品を削除できませんでした" });
      } else {
        const removedmateria = materias.splice(index, 1);
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