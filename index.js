const express = require('express')

const server = express();

server.use(express.json())

const users = ['willyan','roberto','monica']

server.use((req,res,next)=>{
    console.time('Request')
    console.log(`Metodo: ${req.method}; URL: ${req.url}`)
    next()
    console.timeEnd('Request')
})

function checkIfUserExists(req,res,next){
    if (!req.body.name) {
        return res.status(400).json({error:"Name is required!"})
    }
    return next()
}

function checkInArray(req,res,next){
    const user = users[req.params.index]
    if (!user) {
        return res.status(400).json({error:"Use not exists!"})
    }
    req.user = user
    return next()
}

server.get('/users',(req,res)=>{
    return res.json(users)
})

server.get('/users/:index',checkInArray,(req,res)=>{
    //const {index} = req.params;
    return res.json(req.user)
})

server.post('/users',checkIfUserExists,(req,res)=>{
    const { name } = req.body
    users.push(name)
    
    return res.json(users)
})

server.put('/users/:index',checkIfUserExists,checkInArray,(req,res)=>{
    const {index} = req.params;
    const {name} = req.body

    users[index] = name;

    return res.json(users)
})

server.delete('/users/:index',checkInArray,(req,res)=>{
    const {index} = req.params
    users.splice(index,1)
    return res.json(users)
})

server.listen(3000)