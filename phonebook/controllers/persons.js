const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

personsRouter.get("/:id", (request, response, next) => {
  Person.findById(request.params.id) //break
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

personsRouter.post("/", (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

personsRouter.delete("/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      console.log(response);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

personsRouter.put("/:id", (request, response, next) => {
  const { name, number } = request.body;

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

personsRouter.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      const dateNow = new Date();
      response.send(
        `<p>Phonebook has info for ${count} people</br>${dateNow}</p>`
      );
    })
    .catch((error) => next(error));
});

module.exports = personsRouter;
