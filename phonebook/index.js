require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Person = require("./models/person");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// const Person = mongoose.model("Person", personSchema);

app.use(express.json()); //express.json() is middleware. This middleware is responsible for parsing incoming request bodies with JSON payloads.

app.use(morgan("tiny"));

app.use(cors());

app.use(express.static("dist"));

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  const dateNow = new Date();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</br>${dateNow}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  // response.json(persons);
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  // const id = Number(request.params.id);
  // console.log(id);
  // const person = persons.find((person) => {
  //   console.log(person.id, typeof person.id, id, typeof id);
  //   return person.id === id;
  // });
  // console.log(person);

  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

// const generateId = () => {
//   const id = persons.length > 0 ? Math.floor(Math.random() * 100) : 0;
//   return id;
// };

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number missing",
    });
  }

  // if (persons.find((person) => person.name === body.name)) {
  //   return response.status(400).json({
  //     error: "Name must be unique",
  //   });
  // }

  // if (persons.find((person) => person.number === body.number)) {
  //   return response.status(400).json({
  //     error: "Number must be unique",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    // id: generateId(),
  });

  // persons = persons.concat(person);
  // response.json(person);

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
