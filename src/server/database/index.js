const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");

const lowDB = {};
lowDB.createDB = createDB;

async function createDB(filename) {
  const adapter = new FileAsync(filename);
  const db = await low(adapter);
  db.defaults({
    posts: [
      {
        id: 1,
        text: "this is the first post",
        user: { avatar: null, username: "user1" }
      }
    ]
  }).write();
  return db;
}

export default lowDB;
