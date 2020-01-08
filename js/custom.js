var app = new Vue({
  el: '#app',
  data: {
  	todo: '',
    todoList: [],
    active: 'all',
    numCompleted: 0,
    all: false
  },
  computed: {
  	filteredItems() {
  		return this.todoList.filter(todo => {
  			if (this.active == 'completed')
  				return todo.completed
  			else if (this.active == 'todo') 
  				return !todo.completed
  			else
  				return todo
  		})
  	},
  },
  created() {
  	this.fetchJson()
  },
  methods: {
  	addTodo: function() {
  		this.todoList.push({
  			name: this.todo,
  			completed: false,
  			time: this.now()
  		})
  		this.todo = ''
  		this.updateJson()
  	},
  	numTodos: function() {
  		return this.todoList.length
  	},
  	numTodosCompleted: function() {
  		var completed = 0
  		this.todoList.forEach(todo => {
  			if (todo.completed) {
  				completed++
  			}
  		})
  		return completed
  	},
  	removeTodo: function(index) {
  		this.todoList.splice(index, 1)
  	},
	completedTimeHandler: function(todo) {
		if (!todo.completed) {
			todo.completed = true
			todo.time = 'Completed at ' + this.now()
			// increment when added
			this.numCompleted++
			if (this.numCompleted == this.todoList.length) {
				this.all = true
			}
		} else {
			todo.completed = false
			todo.time = this.now()
			// detick the select all
			this.all = false
			// decrement when unticked
			this.numCompleted--
			
		}
		this.updateJson()
	},
	checkAll: function() {
		if (!this.all) {
			this.todoList.forEach(todo => {
				todo.completed = true
				todo.time = 'Completed at ' + this.now()
			})
		} else {
			this.todoList.forEach(todo => {
				todo.completed = false
				todo.time = this.now()
			})
			this.all = false
		}
		this.updateJson()
	},
	checkAllCompleted: function() {
		console.log('im running', this.todoList.length)		
		for (todo of this.todoList) {
			if (!todo.completed) {
				return false
			}
		}
  		return true
	},
	now: function() {
		return moment().format("L LTS")
	},
	updateJson: function() {
		axios.put('https://api.myjson.com/bins/174x4k', this.todoList)
	},
	fetchJson: function() {
		axios.get('https://api.myjson.com/bins/174x4k').then(response => {
			this.todoList = response.data
			if (this.numTodosCompleted() == this.todoList.length) {
				this.all = true
				this.numCompleted = this.numTodosCompleted()
			}
		})
	}
  }
})