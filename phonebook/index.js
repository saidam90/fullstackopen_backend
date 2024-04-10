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

app.get("/api/persons/info", (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      const dateNow = new Date();
      response.send(
        `<p>Phonebook has info for ${count} people</br>${dateNow}</p>`
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (request, response) => {
  // response.json(persons);
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.get("/api/persons/:id", (request, response, next) => {
  // const id = Number(request.params.id);
  // console.log(id);
  // const person = persons.find((person) => {
  //   console.log(person.id, typeof person.id, id, typeof id);
  //   return person.id === id;
  // });
  // console.log(person);

  Person.findById(request.params.id) //break
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
  // .catch((error) => {
  //   console.log(error);
  //   response.status(400).end();
  // });
});

app.use(errorHandler);

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
  // const id = Number(request.params.id);
  // persons = persons.filter((person) => person.id !== id);

  // response.status(204).end();
});

// const generateId = () => {
//   const id = persons.length > 0 ? Math.floor(Math.random() * 100) : 0;
//   return id;
// };

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: "The name or number missing",
  //   });
  // }

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

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  // const person = {
  //   name: body.name,
  //   number: body.number,
  //   // id: generateId(),
  // };

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
