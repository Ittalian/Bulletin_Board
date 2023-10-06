// データベースの設定を記述するファイルです
const sqlite = require('sqlite3');
const db = new
sqlite.Database('./storage/bbs.sqlite');
db.run('PRAGMA foreign_keys=true');

db.run('create table if not exists threads(\
    id integer primary key autoincrement,\
    title text,\
    contents text)');
db.run('create table if not exists comments(\
    id integer primary key autoincrement,\
    thread_id integer,\
    comment text,\
    foreign key (thread_id) references threads(id))');
// db.run('delete from threads');
// db.run('delete from comments');

module.exports = db;