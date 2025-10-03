const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",     
  password: "",     
  database: "todo_db"
});

db.connect(err => {
  if (err) {
    console.error("MySQL ulanishda xato:", err);
    return;
  }
  console.log("MySQL ulandi!");
});


app.post("/todos", (req, res) => {
  const { title } = req.body;
  db.query("INSERT INTO todos (title, done) VALUES (?, ?)", [title, 0], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ id: result.insertId, title, done: 0 });
  });
});

app.get("/todos", (req, res) => {
  db.query("SELECT * FROM todos", (err, rows) => {
    if (err) return res.status(500).send(err);
    res.send(rows);
  });
});

app.put("/todos/:id", (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  db.query("UPDATE todos SET title = ? WHERE id = ?", [title, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ id, title });
  });
});

app.patch("/todos/:id/done", (req, res) => {
  const { id } = req.params;
  db.query("UPDATE todos SET done = 1 WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ id, done: 1 });
  });
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM todos WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "O'chirildi", id });
  });
});

app.listen(3000, () => {
  console.log("Server http://localhost:3000 da ishlayapti");
});
