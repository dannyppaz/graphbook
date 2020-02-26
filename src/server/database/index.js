const low = require("lowdb");
const lodashId = require("lodash-id");
const shortid = require("shortid");
const FileAsync = require("lowdb/adapters/FileAsync");

const db = {};
db.createDB = createDB;

async function createDB(filename) {
  const adapter = new FileAsync(filename);
  const db = await low(adapter);
  db._.mixin(lodashId);
  db.defaults({
    posts: [
      {
        id: shortid.generate(),
        text: "Lorem ipsum 1",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: "user1"
      },
      {
        id: shortid.generate(),
        text: "Lorem ipsum 2",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: "user2"
      }
    ],
    users: [
      {
        id: shortid.generate(),
        username: "user1",
        avatar: "/uploads/avatar1.png"
      },
      {
        id: shortid.generate(),
        username: "user2",
        avatar: "/uploads/avatar2.png"
      }
    ],
    messages: [
      {
        id: shortid.generate(),
        text: "This is message 1",
        user: "user1",
        chat: "chat1"
      }
    ],
    chats: [
      {
        id: "chat1",
        messages: ["message1"],
        users: ["user1"]
      }
    ]
  }).write();

  return db;
}

export default db;
