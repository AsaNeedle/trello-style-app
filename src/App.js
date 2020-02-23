import React, { useState } from 'react';
import './App.css';

function App() {
  const [isPersist, setIsPersist] = useState(false)
  const [columns, setColumns] = useState([
    {
      title: "numbers",
      tickets: [
        {content: "billion", done: false},
        {content: "million", done: true},
        {content: "pi", done: false},
        {content: "e", done: true},
        {content: "i", done: false},
        {content: "six", done: true},
      ]
    },
    {
      title: "things to say",
      tickets: [
        {content: "koniichiwa", done: false},
        {content: "sayonara", done: true},
        {content: "ohayoo", done: false}
      ]
    },
    {
      title: "phrases",
      tickets: [
        {content: "hey", done: false},
        {content: "yo", done: true},
        {content: "sup", done: false}
      ]
    }
  ])
    
  // function DisplayInput (props) {
  //   const displayInput = props.displayInput
  //   if (displayInput){
  //     return <TicketForm />
  //   } else {
  //     return null
  //   }
  // }

  // check equivalence of objects
  function isEquivalent(a, b) {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);
    if (aProps.length !== bProps.length) {
      return false;
    }
    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  }

  const updatePersistData = (data) => {
    localStorage.setItem('myData', JSON.stringify(data))
  }

  const dragStart = (e) => {
    e.dataTransfer.setData("Ticket", e.target.id)
    e.dataTransfer.setData("Origin", e.target.getAttribute('name'))
  }
  const dragging = (e) => {
    return
  }
  const allowDrop = (e) => {
    e.preventDefault();
  }

  const drop = (e) => {
    e.preventDefault();
    const ticket = e.dataTransfer.getData("Ticket")
    const origin = e.dataTransfer.getData("Origin")
    if (e.target.getAttribute("class") === "column" && e.target.id !== origin){   
      let newColumns = addTicket(e.target.id, ticket, columns)
      newColumns = removeTicket(origin, ticket, newColumns)
      setColumns(newColumns)
      updatePersistData(newColumns)
    }
  }

  const addTicket = (title, val, state) => {
    const newColumns = state.map((col) => {
      if (col.title === title) {
        return {
                title: col.title, 
                tickets: [...col.tickets, {content: val, done: false}]
              }   
      } else {
        return col
      }
    });
    return newColumns
  }

  const removeTicket = (origin, val, state) => {
    const newColumns = state.map((col) => {
      if (col.title === origin) {
        return {
                title: col.title, 
                tickets: col.tickets.filter((t) => {
                  return t.content !== val
                })
              }   
      } else {
        return col
      }
    });
    return newColumns
  }

  const removeColumn = (title) => {
    const newColumns = columns.filter((column) => column.title !== title);
    setColumns(newColumns)
    updatePersistData(newColumns)
  }

  class Ticket extends React.Component {
    constructor(props){
      super(props)
      this.state={
        text: props.text,
        done: false
      }
    }

    toggleDone = () => {
      this.setState({done: !this.state.done}) 
    }

    render(){
      return (
        <div className="ticket"
             name={this.props.column}
             id={this.state.text} 
             draggable="true"
             onDragStart={dragStart}
             onDrag={dragging}
             style={this.state.done ? { textDecoration: "line-through" } : {}} onClick={this.toggleDone}>
          {this.state.text} 
        </div>
      )
    }
  }

  class TicketColumn extends React.Component {
    constructor(props){
      super(props)
      this.state = {items: props.items, title: props.title}
    }
    render(){
      return (
        <div className="column"
             id={this.state.title}
             onDrop={drop}
             onDragOver={allowDrop}>
        <header><b>{this.state.title}</b></header>
        <button onClick={() => {removeColumn(this.state.title)}}>X</button>
        <br/>
        {this.state.items.map((item, i) => { 
          return <Ticket key={i} column={this.state.title} done={item.done} text={item.content}/>
        })}
        <br/>
        <TicketForm title={this.state.title}/>
        </div>
      )
    }
  }

  class Workspace extends React.Component {
    constructor(props){
      super(props)
      this.state = {}
      this.state = {columns: props.columns}
    }
    componentDidMount(){
      const persistedData = JSON.parse(localStorage.getItem('myData' || null))
      if (persistedData && !isPersist & !isEquivalent(columns, persistedData)){
        setColumns(persistedData)
        setIsPersist(true)
      }
    }

    render(){
      const { columns } = this.props
      return(
        <div className="flex-container">
        { columns.map((column, i) => {
            return <TicketColumn key={i} items={column.tickets} title={column.title}/>
          })
        }
        <ColumnForm />
        </div>
      )
    }
  }

  class TicketForm extends React.Component {

    constructor(props) {
      super(props)
      this.state = {value: '', title: props.title}
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event){
      this.setState({value: event.target.value})
    }

    handleSubmit(event){
      if (this.state.value !== ""){
        const newColumns = addTicket(this.state.title, this.state.value, columns)
        setColumns(newColumns)
        updatePersistData(newColumns)
      } 
      event.preventDefault();
    }

    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            <input className="tkt-input" type="text" placeholder="Add new ticket" value={this.state.value} onChange={this.handleChange}/>
          </label>
          <input className="input-tkt-btn"type="submit" value="Submit" />
        </form>
      );
    }
  }

  class ColumnForm extends React.Component {

    constructor(props) {
      super(props)
      this.state = {value: ''}
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event){
      this.setState({value: event.target.value})
    }

    handleSubmit(event){
      if (this.state.value !== ""){
        const newColumns = [...columns, {
          title: this.state.value,
          tickets: []
        }]
        setColumns(newColumns);
      }
      event.preventDefault();
    }

    render() {
      return (
        <form className="column" onSubmit={this.handleSubmit}>
          <label>
            <input className="col-input" type="text" placeholder="Add new column" value={this.state.value} onChange={this.handleChange}/>
          </label>
          <input className="input-col-btn" type="submit" value="Submit" />
        </form>
      );
    }
  }
  return (
    <div>
      <header id="title" >Aloe</header>
      <Workspace columns={columns} />
    </div> )
}


export default App;
