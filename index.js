const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

const morgan = require('morgan')

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('id :method :url :status :response-time :res-body '))



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons',(require, response) => {
  response.send(persons)
}
)

app.get('/info', (require, response) => {
    const fechaActual = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people <br/> ${fechaActual}</p>`)
})

app.get('/api/persons/:id',(require, response) => {
  const id = Number(require.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.send(person)
  } else {
    response.status(404).end()
  }
})


app.delete('/api/persons/:id',(require, response) => {
  const id = Number(require.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})



app.post('/api/persons/', (require, response) =>{
   const body = require.body
   const findName = persons.find( person => person.name === body.name)
   if (!body) {
    return response.status(400).json(
    { error: 'content is missing'}
    )
   } else if (!body.name || !body.number){
    return response.status(400).json({
      error: 'Falta el nombre o el numero'
    })
   } else if (findName){
    return response.status(400).json({
      error: 'El Nombre ya existe en la agenda'})
   }
   
   const generateId = Math.round((Math.random() * 10000))
   const person = {
    'id': generateId,
    'name': body.name,
    'number': body.number
   }
   
    persons = persons.concat(person)
    response.json(persons)
    morgan.token('res-body', (req, res) => {
      persona = { "name": person.name, "number": person.number }
      return person ? JSON.stringify(persona) : '';
  })
   }
)


  



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`El server se abrio bajo el puerto: ${PORT}`)
})