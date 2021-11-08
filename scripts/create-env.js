//Esto permite trabajar con un modulo directamente de node
//Significa fail sistem
const fs = require('fs')
//asignando nuestras variables de entorno
fs.writeFileSync('./.env', `API=${process.env.API}\n`)
