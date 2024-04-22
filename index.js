require('dotenv').config()
const PersonDB = require('./models/persondb')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')



const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


// Define a custom format that includes the body for POST requests only
morgan.format('custom', (tokens, req, res) => {
    // Common 'tiny' format tokens
    const tinyFormat = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ');
  
    // Append the body for POST requests only
    if (req.method === 'POST' && Object.keys(req.body).length > 0) {
      return `${tinyFormat} ${JSON.stringify(req.body)}`;
    }
  
    // Don't append body for other request types or empty bodies
    return tinyFormat;
  });
  
  // Use the custom format in Morgan middleware
  app.use(morgan('custom'));



let persons = [
    // {   
    //     id: 1,
    //     name: "Arto Hellas", 
    //     number: "040-123456"
    //   },
    //   { 
    //     id: 2,
    //     name: "Ada Lovelace", 
    //     number: "39-44-5323523"
    //   },
    //   { 
    //     id: 3,
    //     name: "Dan Abramov", 
    //     number: "12-43-234345"
    //   },
    //   { 
    //     id: 4,
    //     name: "Mary Poppendieck", 
    //     number: "39-23-6423122"
    //   }
]

const generateId = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)


app.get('/info', (request, response) => {
  response.send(`<div> 
            <p>Phone has info for ${persons.length} </p> 
            ` + new Date() + `</div>`)  
})

app.get('/api/persons', (request, response) => {
  PersonDB.find({}).then(
    data => { 
      persons = data
      console.log('persons:',persons)
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(400).json({
        error: 'person not found'
      })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    PersonDB.findByIdAndDelete(id).then(result => {
      if (result) {
        console.log('deleted:',result)
        persons = persons.filter(person => person.id !== id)
  
        response.status(204).end()
      } else {
        console.log('error deleting:',result)
        response.status(404).send({ error: 'Person not found' });
      }
    }).catch(error => {
      console.error(error);
      response.status(500).send({ error: 'Server error' });
  });


  })

app.post('/api/persons', (request, response) => {
    const body = request.body    
    
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
  
    const person = new PersonDB({
      name: body.name,
      number: body.number,      
    }) 
    
  
    person.save().then(result => {
      console.log('person saved:',result)
      persons = persons.concat(result)
      response.json(result) 
    })    
  })

const unknownEndpoint = (request, response) => {
response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})