import SQLite from 'react-native-sqlite-storage';

const database_name = 'MyDatabase.db';
const database_version = '1.0';
const database_displayname = 'My SQLite Database';
const database_size = 200000;

const db = SQLite.openDatabase(
  database_name,
  database_version,
  database_displayname,
  database_size
);

export default db;
