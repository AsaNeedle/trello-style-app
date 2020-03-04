import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import isEquivalent from './utils/isequivalent'
import './App.css';

function App() {
  const [isPersist, setIsPersist] = useState(false)
  const [dropColumn, setDropColumn] = useState(false)
  const [tickets, setTickets] = useState([
    {id: 0, content: "python", done: false},
    {id: 1, content: "ruby", done: false},
    {id: 2, content: "javascript", done: true},
    {id: 3, content: "haskell", done: false},
    {id: 4, content: "Staten Island", done: true},
    {id: 5, content: "Brooklyn", done: false},
    {id: 6, content: "Queens", done: true},
    {id: 7, content: "Bronx", done: false},
    {id: 8, content: "Manhattan", done: true},
    {id: 9, content: "Aramis", done: false},
    {id: 10, content: "Athos", done: false},
    {id: 11, content: "Porthos", done: true},
  ])
  const [columns, setColumns] = useState([
    {
      id: 0,
      title: "Languages",
      tickets: [0, 1, 2, 3]
    },
    {
      id: 1,
      title: "Boroughs",
      tickets: [4, 5, 6, 7, 8]
    },
    {
      id: 2,
      title: "Musketeers",
      tickets: [9, 10, 11]
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


  const updatePersistData = (data) => {
    return
    localStorage.setItem('myData', JSON.stringify(data))
  }

  const dragStart = (e) => {
    e.dataTransfer.setData("TicketName", e.target.id)
    e.dataTransfer.setData("OriginId", e.target.name)
    e.dataTransfer.setData("TicketId", e.target.index)
  }
  const dragging = (e) => {
    return
  }
  const allowDrop = (e) => { 
    e.preventDefault();
    // if (e === dropColumn){
    //   return
    // }
    // const originId = e.dataTransfer.getData("OriginId")
    // if (e.target.getAttribute("class") === "column"){
    //   if (e.target.id !== originId){
    //     setDropColumn(e)
    //   } else {
    //     setDropColumn(false)
    //   }
    // }
  }

  const drop = (e) => {
    e.preventDefault();
    console.log(e.target.id)
    const ticketName = e.dataTransfer.getData("TicketName")
    const originId = e.dataTransfer.getData("OriginId")
    const ticketId = () => {
      for (let c of columns){
        let colTickets = c.tickets
        for (let t in colTickets){
          let curTicket = colTickets[t]
          if (tickets[curTicket].content === ticketName){
            return curTicket
          }
        }
      }
      return null
    }
    const tId = ticketId()
    if (e.target.getAttribute("class") === "column" && e.target.id !== originId){ 
      let newColumns = moveTicket(e.target.id, tId, ticketName, columns)
      setColumns(newColumns)
      updatePersistData(newColumns)
    }
  }

  const moveTicket = (colId, ticketId, val, columns) => {
    const newColumns = columns.map((col) => {
      // removes ticket from origin
      if (col.tickets.includes(ticketId)){
        let srcCol = {
          id: col.id,
          title: col.title,
          tickets: col.tickets.filter(x => x != ticketId)
        }
        return srcCol
      }
      // add ticket to destination
      if (col.id == colId) {
        const destCol = {
          id: col.id,
          title: col.title, 
          tickets: [...col.tickets, ticketId]
        }
        return destCol
      } else {
        return col
      }
    });
    return newColumns
  }

  const addTicket = (id, val, columns, tickets) => {
    const newTicketId = tickets.length
    const newTickets = [...tickets, {id: newTicketId, content: val, done: false}]
    const newColumns = columns.map((col) => {
      if (col.id === id) {
        return {
                id: col.id,
                title: col.title, 
                tickets: [...col.tickets, newTicketId]
              }   
      } else {
        return col
      }
    });
    return [newColumns, newTickets]
  }

// deprecated?
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
        index: props.index,
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
             index={this.state.index}
             draggable="true"
             onDragStart={dragStart}
             onDrag={dragging}
             style={this.state.done ? { textDecoration: "line-through" } : {}} onClick={this.toggleDone}>
          {"\xa0" + this.state.text} 
        </div>
      )
    }
  }

  class TicketColumn extends React.Component {
    constructor(props){
      super(props)
      this.state = {items: props.items, title: props.title, id: props.id}
    }
    render(){
      return (
        <div className="column"
             id={this.state.id}
             onDrop={drop}
             onDragOver={allowDrop}>
        <header><b>{"\xa0" + this.state.title}</b></header>
        <button onClick={() => {removeColumn(this.state.id)}}>X</button>
        <br/>
        {this.state.items.map((item, i) => { 
          return <Ticket key={i} column={this.state.id} 
                                 index={item.id} 
                                 done={item.done} 
                                 text={item.content}/>
        })}
        <br/>
        <br/>
        <br/>
        <div>^^^Drag here to add!^^^</div>
        <TicketForm id={this.state.id}/>
        </div>
      )
    }
  }

  class Workspace extends React.Component {
    constructor(props){
      super(props)
      this.state = {columns: props.columns, tickets: props.tickets}
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
      const { tickets } = this.props
      return(
        <div className="flex-container">
        { columns.map((column, i) => {
            return <TicketColumn key={i} 
                                 items={column.tickets.map((id) => tickets[id])} 
                                 title={column.title} 
                                 id={column.id}/>
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
      this.state = {value: '', id: props.id}
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event){
      this.setState({value: event.target.value})
    }

    handleSubmit(event){
      if (this.state.value !== ""){
        const res = addTicket(this.state.id, this.state.value, columns, tickets)
        const newColumns = res[0]
        const newTickets = res[1]
        setColumns(newColumns)
        setTickets(newTickets)
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
      this.state = {id: columns.length, value: ''}
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event){
      this.setState({value: event.target.value})
    }

    handleSubmit(event){
      if (this.state.value !== ""){
        const newColumns = [...columns, {
          id: this.state.id,
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
    <div class="container">
      <header class="container-fluid" id="title" >Aloe</header>
      <Workspace columns={columns} tickets={tickets}/>
    </div> )
}


export default App;
