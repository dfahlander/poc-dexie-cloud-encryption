import Dexie, { Table } from 'dexie';
import { applyEncryptionMiddleware, NON_INDEXED_FIELDS, clearEncryptedTables  } from 'dexie-encrypted';
import dexieCloud from 'dexie-cloud-addon';

export interface Friend {
  id?: number;
  name: string;
  age: number;
}

const encryptionKey = new Uint8Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]);

function reorderDexieEncrypted (db: Dexie) {
  // @ts-ignore
  const mw = db._middlewares.dbcore.find(mw => mw.name === 'encryption');
  if (!mw) throw new Error("Dexie encrypted not applied");
  db.use({
    name: "encryption",
    stack: "dbcore",
    level: 2,
    create: mw.create
  });
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  friends!: Table<Friend>; 

  constructor() {
    super('myDatabase', {addons: [dexieCloud]});
    this.cloud.configure({
      databaseUrl: "https://zpx8zgqwh.dexie.cloud",
      unsyncedTables: ["_encryptionSettings"]
    });
    
    // @ts-ignore (need this for typings incompability with dexie-encrypted and dexie 4.x)
    applyEncryptionMiddleware(this, encryptionKey, {
      friends: "NON_INDEXED_FIELDS",
    }, async ()=>{});
    reorderDexieEncrypted(this);

    this.version(11).stores({
      friends: '@id' // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
//clearEncryptedTables(db);

// @ts-ignore
window.db = db;
