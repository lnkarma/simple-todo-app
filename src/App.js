import React from "react";
import "./App.scss";

function Button(props) {
  return <button className="button is-inline">{props.children}</button>;
}

class TodoElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.todo.text,
      tempText: this.props.todo.text,
      isEditing: false,
    };
    this.todoTextInput = React.createRef();
  }
  componentDidUpdate() {
    if (this.state.isEditing) {
      this.todoTextInput.current.focus();
    }
  }
  render() {
    let span;
    let button;
    if (this.state.isEditing) {
      span = (
        <input
          type="text"
          placeholder="New Todo"
          className="input is-inline"
          value={this.state.text}
          onChange={(e) => {
            this.setState({ text: e.target.value });
          }}
          ref={this.todoTextInput}
        />
      );
      button = (
        <span className="is-inline">
          <span
            onClick={(e) => {
              e.preventDefault();
              this.setState({ isEditing: false });
              this.props.onUpdate(this.state.text);
            }}
          >
            <Button>
              <b>Update todo</b>
            </Button>
          </span>
          <span
            onClick={() => {
              this.setState({ isEditing: false, text: this.state.tempText });
            }}
          >
            <Button>
              <b>X</b>
            </Button>
          </span>
        </span>
      );
    } else {
      span = <span>{this.state.text}</span>;
      if (this.props.todo.done) {
        span = (
          <strike>
            <span>{this.state.text}</span>
          </strike>
        );
      }
      button = (
        <span onClick={this.props.onDelete}>
          <Button>
            <b>X</b>
          </Button>
        </span>
      );
    }
    return (
      <div className="columns">
        <form>
          <span className="column is-inline">
            <input
              type="checkBox"
              className="checkBox"
              checked={this.props.todo.done}
              onChange={this.props.onChange}
            />
          </span>
          <span
            className="column is-10 is-inline"
            onClick={() => {
              this.setState({ isEditing: true, tempText: this.state.text });
            }}
            style={{ width: "90%" }}
          >
            {span}
          </span>
          <span className="column is-inline">{button}</span>
        </form>
      </div>
    );
  }
}

function TodoList(props) {
  let completedTodos = [];
  let todos = [];
  props.todos.forEach((todo) => {
    const todoElm = (
      <div className="panel-block" key={todo.id}>
        <TodoElement
          todo={todo}
          onDelete={() => props.onDelete(todo.id)}
          onChange={() => props.toggleDone(todo.id)}
          onUpdate={(text) => props.updateTodo(todo.id, text)}
        ></TodoElement>
      </div>
    );
    if (todo.done) {
      completedTodos.push(todoElm);
    } else {
      todos.push(todoElm);
    }
  });

  return (
    <div>
      <div className="panel">
        <p className="panel-heading">Todos</p>
        {todos}
      </div>
      <div className="panel">
        <p className="panel-heading">Completed Todos</p>
        {completedTodos}
      </div>
    </div>
  );
}

class AddTodo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { todoText: "" };
    this.todoTextInput = React.createRef();
  }
  componentDidMount() {
    this.todoTextInput.current.focus();
  }
  componentDidUpdate() {
    this.todoTextInput.current.focus();
  }
  updateTodoText = (e) => {
    this.setState({ todoText: e.target.value });
  };
  render() {
    return (
      <div className="panel">
        <p className="panel-heading">Add Todo</p>
        <div className="panel-block">
          <form className="a">
            <input
              type="text"
              placeholder="New Todo"
              className="input is-inline addTodoInput"
              onChange={this.updateTodoText}
              value={this.state.todoText}
              ref={this.todoTextInput}
            />
            <input
              type="submit"
              className="button is-inline"
              value="Add Todo"
              onClick={(e) => {
                e.preventDefault();
                let text = this.state.todoText;
                this.setState({ todoText: "" });
                this.props.onAdd(text);
              }}
            />
          </form>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: JSON.parse(localStorage.getItem("todos")) || [],
    };
  }

  saveTodos = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
    this.setState({ todos: todos });
  };

  handleDelete = (id) => {
    let todos = this.state.todos;
    todos.splice(
      todos.findIndex((todo) => todo.id === id),
      1
    );
    this.saveTodos(todos);
  };

  handleAdd = (todoText) => {
    if (todoText === "") return;
    let todos = this.state.todos;
    let { id = -1 } = todos[todos.length - 1] || {};
    todos.push({
      id: id + 1,
      text: todoText,
      done: false,
    });
    this.saveTodos(todos);
  };

  toggleDone = (id) => {
    let todos = this.state.todos;
    let index = todos.findIndex((todo) => todo.id === id);
    todos[index].done = !todos[index].done;
    this.saveTodos(todos);
  };

  handleUpdate = (id, text) => {
    if (text === "") return;
    let todos = this.state.todos;
    let index = todos.findIndex((todo) => todo.id === id);
    todos[index].text = text;
    this.saveTodos(todos);
  };
  render() {
    return (
      <div className="App">
        <div className="todoApp">
          <h1 className="title">Todo List</h1>
          <AddTodo
            onAdd={(todoText) => {
              this.handleAdd(todoText);
            }}
          ></AddTodo>
          <TodoList
            todos={this.state.todos}
            onDelete={(todoID) => {
              this.handleDelete(todoID);
            }}
            toggleDone={(todoID) => {
              this.toggleDone(todoID);
            }}
            updateTodo={(todoID, text) => {
              this.handleUpdate(todoID, text);
            }}
          ></TodoList>
        </div>
      </div>
    );
  }
}

export default App;
