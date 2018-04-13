var express = require('express');
var app = express()
var bodyParser = require('body-parser')
var _ = require('underscore')
var db = require('./db.js')
var PORT = process.env.PORT || 3000
var todos = []
var todoNextId = 1

app.use(bodyParser.json())

app.get('/', function(req, res) {
	res.send('To DO API Root');
})

//GET request
// GET /todos?completed=true&q=house
app.get('/todos', function(req, res) {
	var queryParams = req.query
	var fileterdTodos = todos
	if (queryParams.hasOwnProperty('completed') && queryParams.completed == 'true') {
		fileterdTodos = _.where(fileterdTodos, {
			completed: true
		})
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed == 'false') {
		fileterdTodos = _.where(fileterdTodos, {
			completed: false
		})
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		fileterdTodos = _.filter(fileterdTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q) > -1
		})
	}
	res.json(fileterdTodos)
})

//todos/id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10)
	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON())
		} else {
			res.status(404).send()
		}
	}, function(e) {
		res.status(500).json(e)
	})
	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// })
	// if (matchedTodo) {
	// 	res.json(matchedTodo)
	// } else {
	// 	res.status(404).send()
	// }

})

//POST
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, "description", "completed")
	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON())
	}, function (e) {
		res.status(404).json(e)
	})
	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length == 0) {
	// 	return res.status(404).send()
	// }
	// body.description = body.description.trim()
	// body.id = todoNextId++
	// 	todos.push(body)
	// res.json(body)
})

//DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10)
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	})
	if (!matchedTodo) {
		res.status(404).json({
			"error": "no todo find with that id"
		})
	} else {
		todos = _.without(todos, matchedTodo)
		res.json(todos)
	}
})

//Put (Update) /todos/:id/

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10)
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	})

	var body = _.pick(req.body, "description", "completed")
	var validAttributes = {}

	if (!matchedTodo) {
		return res.status(404).send()
	}
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send()
	} else {
		//Never provided attribute, no problem here
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send()
	} else {
		//Never provided attribute, no problem here
	}
	_.extend(matchedTodo, validAttributes)
	res.json(matchedTodo)
})

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT)
	})
})