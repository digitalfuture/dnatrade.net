import Dexie from 'dexie'

const db = new Dexie('App')
db.version(1).stores({
  charts: 'chartName, selectedRange'
})

export default db
