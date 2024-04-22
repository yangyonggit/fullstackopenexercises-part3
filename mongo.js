const mongoose = require('mongoose')

let personSchema = null


const connectToMongo= (password) =>{
  const url =  
  `mongodb+srv://vector:${password}@fullstack-persons-db.vs25c4w.mongodb.net/?retryWrites=true&w=majority&appName=fullstack-persons-db`

  mongoose.set('strictQuery',false)

  return mongoose.connect(url).then(result => {
    console.log('Connected to MongoDB')
    personSchema = setupSchema()
  }).catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
}

const setupSchema = () => {
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  console.log('Schema setup')
  const person = mongoose.model('Persons', personSchema)
  return person
}

const addPerson = (person,number) => {
  const personData = new personSchema({
    name: person,
    number: number,
  })
  personData.save().then(result => {
    console.log(`Added ${person} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

const listPersons =() =>{
  console.log('phonebook:')
  personSchema.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

const getAllPersons = () =>{
  return personSchema.find({})
}

const colseConnection = () =>{
  mongoose.connection.close()
}

const testDB = () =>{
  if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }else if (process.argv.length === 3){
    const password = process.argv[2]
    connectToMongo(password).then(result => {      
      listPersons() 
    })
   
  }else if (process.argv.length === 5){
    const password = process.argv[2]
    const person = process.argv[3]
    const number = process.argv[4]
    connectToMongo(password).then(result => {      
      addPerson(person,number)
    })    
  }else{
    console.log('Invalid number of arguments')
    process.exit(1)
  }  
}

if (process.argv.length > 1 && process.argv[1].includes('mongo.js'))
  testDB()

// module.exports = {connectToMongo,setupSchema,addPerson,listPersons,getAllPersons,colseConnection}