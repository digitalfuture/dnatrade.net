const r = require('rethinkdb')
// Set config
const rethinkdb = {
  host: 'localhost',
  port: 28015,
  db: 'robot'
}

let DATABASE = rethinkdb.db
let TABLES = [
  'currencies',
  'charts',
  'balances',
  'prices',
  'depositsWithdrawals',
  'depositsWithdrawalsAllCurrencies',
  'history',
  'balanceCharts',
  'portfolioChartData',
  'users'
]

//
// Functions
function dbSetup() {
  return connect().then(conn => {
    console.log(' [-] Database Setup')
    return createDbIfNotExists(conn)
      .then(() =>
        Promise.all(TABLES.map(table => createTableIfNotExists(conn, table)))
      )
      .then(() => closeConnection(conn))
  })
}

function dbDrop() {
  console.log(' [-] Drop DB:', DATABASE)

  return connect().then(conn =>
    r
      .dbDrop(DATABASE)
      .run(conn)
      .error(() =>
        console.log(
          'Error dropping DB',
          DATABASE,
          ', probably DB not exist. Exit task.'
        )
      )
      .then(() => closeConnection(conn))
  )
}

function connect() {
  // console.log(' [-] Open connection!')
  return r.connect(rethinkdb)
}

function createDbIfNotExists(conn) {
  return getDbList(conn).then(list => {
    if (list.indexOf(DATABASE) === -1) {
      return createDatabase(conn)
    } else {
      console.log(' [!] Database already exists:', DATABASE)
      return Promise.resolve(true)
    }
  })
}

function createTableIfNotExists(conn, table) {
  return getTableList(conn).then(list => {
    if (list.indexOf(table) === -1) {
      return createTable(conn, table)
    } else {
      console.log(' [!] Table already exists:', table)
      return Promise.resolve(true)
    }
  })
}

function getDbList(conn) {
  return r.dbList().run(conn)
}

function getTableList(conn) {
  return r
    .db(DATABASE)
    .tableList()
    .run(conn)
}

function createDatabase(conn) {
  console.log(' [-] Create Database:', DATABASE)
  return r.dbCreate(DATABASE).run(conn)
}

function createTable(conn, table) {
  console.log(' [-] Create Table:', table)
  return r
    .db(DATABASE)
    .tableCreate(table)
    .run(conn)
}

function closeConnection(conn) {
  // console.log(' [x] Close connection!')
  return conn.close()
}

function insert({ table, doc }) {
  return r.table(table).insert(doc)
}

function upsert({ table, id, doc }) {
  return r.table(table).insert({ doc, id }, { conflict: 'replace' })
}

function update({ table, id, doc }) {
  return r.table(table).insert({ doc, id }, { conflict: 'update' })
}

function get({ table, id }) {
  return r.table(table).get(id)
}

function table(table) {
  return r.table(table)
}

module.exports = {
  dbSetup,
  dbDrop,
  connect,
  closeConnection,
  insert,
  upsert,
  update,
  get,
  table
}
