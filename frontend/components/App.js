import React from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state= {
    todos: [],
    error: '',
    todoNameInput:'',
  }
  onTodoNameInputChange = evt => {
    const {value} = evt.target;
    this.setState({...this.state, todoNameInput: value })
  }

  resetForm = () => {
    this.setState({...this.state, todoNameInput: ''})
  }
  setAxiosResponseError = err => {
    this.setState({...this.state, error: err.response.data.message})
  }
  postNewTodo = () => {
    axios.post(URL, {name: this.state.todoNameInput})
    .then(res => {
      this.fetchAllTodos()
      this.resetForm()
      
    })
    .catch(this.setAxiosResponseError)
  }

  onTodoFormSubmit = evt => {
    evt.preventDefault()
    this.postNewTodo()
  }

  fetchAllTodos = () => {
    axios.get(URL)
    .then(res => {
      this.setState({...this.state, todos: res.data.data})
    })
    .catch(this.setAxiosResponseError)
  }
  toggleCompleted = id => evt => {
    axios.patch(`${URL}/${id}`)
    .then(res => {
      this.fetchAllTodos()
    })
    .catch(this.setAxiosResponseError)
  }
  componentDidMount(){
    this.fetchAllTodos()
  }
  render() {
    return(
    <div>
      <div id="error">Error: {this.state.error}</div>
      <div id="todos">
        <h2>Todos:</h2>
        {
          this.state.todos.map(td => {
            return <div onClick={this.toggleCompleted(td.id)} key={td.id}>{td.name} {td.completed ? '✔️ ' : '' }</div>
          })
        }
      </div>
      <form id='todoForm' onSubmit={this.onTodoFormSubmit}>
      <input value={this.state.todoNameInput} onChange={this.onTodoNameInputChange}type='text' placeholder='Type todo'></input>
      <input type='submit'></input>
      </form>
      <button>Clear Completed</button>
    </div>
    )
  }  
}
