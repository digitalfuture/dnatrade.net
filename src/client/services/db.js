import Dexie from 'dexie'

const db = new Dexie('App')

db.version(1).stores({
  charts: 'chartName, selectedRange',
  settings: 'id, isBtcRate, shortName, fullName'
})

export default db
