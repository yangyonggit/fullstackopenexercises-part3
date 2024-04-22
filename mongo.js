const mongoose = require('mongoose')


const connectToMongo= (password) =>{
  const url =  
  `mongodb+srv://vector:${password}@fullstack-persons-db.vs25c4w.mongodb.net/?retryWrites=true&w=majority&appName=fullstack-persons-db`

  mongoose.set('strictQuery',false)

  mongoose.connect(url)
}

const setupSchema = () => {
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const person = mongoose.model('Persons', personSchema)
  return person
}

const addPerson = (personSchema,person,number) => {
  const personData = new personSchema({
    name: person,
    number: number,
  })
  personData.save().then(result => {
    console.log(`Added ${person} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

const listPersons =(personSchema) =>{
  console.log('phonebook:')
  personSchema.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}


if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}else if (process.argv.length === 3){
  const password = process.argv[2]
  connectToMongo(password)
  const personSchema = setupSchema()
  listPersons(personSchema)
}else if (process.argv.length === 5){
  const password = process.argv[2]
  const person = process.argv[3]
  const number = process.argv[4]
  connectToMongo(password)
  const personSchema = setupSchema()
  addPerson(personSchema,person,number)
}else{
  console.log('Invalid number of arguments')
  process.exit(1)
}

