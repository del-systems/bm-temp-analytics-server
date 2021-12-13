#!/usr/bin/env node

const localtunnel = require('localtunnel')
const express = require('express')
const app = express()

app.use(express.json())
app.post('/', (req, res) => {
    const sortObjectKeys = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})

    req.body.attributes = sortObjectKeys(req.body.attributes)
    req.body.__date = new Date(new Date(req.body.__timestamp * 1000).toLocaleString())
    delete req.body.__timestamp
    console.log(sortObjectKeys(req.body))

    res.sendStatus(202) // Accepted
})

async function main () {
    const server = await new Promise(resolve => {
        let s = app.listen(0, () => resolve(s))
    })
    console.log(`Local server launched at port: ${server.address().port}`)
    const tunnel = await localtunnel({ port: server.address().port })
    console.log(`Local server is accessible by tunnel: ${tunnel.url}`)
    console.log('Waiting incoming requests...')

    tunnel.on('error', err => console.error(`Tunnel error: ${err}`))
}

main()
