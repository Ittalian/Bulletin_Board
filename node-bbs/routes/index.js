// JavaScriptを記述するファイルです
const express = require('express');
const router = express.Router();
const db = require('../db-connector');

router.get('/', (req, res) => {
    db.all('select * from threads', (err, rows) => {
    res.render('index', { title: 'Express', rows });
    });
   });

router.post('/thread', (req, res) => {
    const { title, contents } = req.body;
    const stmt = db.prepare('insert into threads(title, contents) values (?, ?)');
    stmt.run(title, contents, () => {
    res.redirect('/');
    });
   });

router.get('/thread/:id', (req, res) => {
    const id = req.params.id;
    const stmt = db.prepare('select * from threads where id = ?');
    stmt.get(id, (err, thread) => {
    const statement = db.prepare('select * from comments where thread_id = ?');
    statement.all(id, (cerr, rows) => {
    const comments = rows ?? [];
    res.render('thread', { ...thread, comments });
    });
    });
   });

router.post('/thread/:id', (req, res) => {
    const id = req.params.id;
    const comment = req.body.comment;
    const stmt = db.prepare('insert into comments(thread_id, comment) values (?, ?)');
    stmt.run(id, comment, () => {
    res.redirect(`/thread/${id}`);
    });
   });

module.exports = router;