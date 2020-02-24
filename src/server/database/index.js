import RxDB from "rxdb";
import RxDBServerPlugin from "rxdb/plugins/server";
import * as MemoryAdapter from "pouchdb-adapter-memory";
import { postSchema } from "./../models";

RxDB.plugin(RxDBServerPlugin);
RxDB.plugin(MemoryAdapter);

const db = {};
db.create = createDB;

async function createDB() {
  const db = await RxDB.create({
    name: "graphBookDB", // <- name
    adapter: "memory", // <- storage-adapter
    password: "123456", // <- password (optional)
    multiInstance: true, // <- multiInstance (optional, default: true)
    queryChangeDetection: false // <- queryChangeDetection (optional, default: false)
  });

  await db.collection({
    name: "post",
    schema: postSchema
  });

  await db.post.insert({
    id: "1",
    text: "Hello Post"
  });

  return db;
}

export default db;
