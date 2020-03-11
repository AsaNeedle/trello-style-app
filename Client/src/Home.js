import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import isEquivalent from './utils/isequivalent'
import './Home.css';
import TestPage from './TestPage.js'

function Home() {
  const [isPersist, setIsPersist] = useState(false)
  const [dropColumn, setDropColumn] = useState(false)
  const [tickets, setTickets] = useState(
    [
    {id: 0, content: "", done: false},
    {id: 1, content: "", done: false},
    {id: 2, content: "", done: true},
    {id: 3, content: "", done: false},
    {id: 4, content: "", done: true},
    {id: 5, content: "", done: false},
    {id: 6, content: "", done: true},
    {id: 7, content: "", done: false},
    {id: 8, content: "", done: true},
    {id: 9, content: "", done: false},
    {id: 10, content: "", done: false},
    {id: 11, content: "", done: true},
    {id: 12, content: "", done: true},
    {id: 13, content: "", done: true},
    {id: 14, content: "", done: true},
    {id: 15, content: "", done: true},
    {id: 16, content: "", done: true}
  ]
  )

  const [columns, setColumns] = useState([
    {
      id: 0,
      title: "Languages to learn",
      tickets: []
    },
    {
      id: 1,
      title: "Boroughs to explore",
      tickets: []
    },
    {
      id: 2,
      title: "Cats to pet",
      tickets: []
    },
    {
      id: 3,
      title: "More tickets",
      tickets: []
    }
  ])

  useEffect(() => {
    async function effectFunctionTickets(){
      const response = await fetch('/tickets');
      const body = await response.json()
      if (response.status !== 200) throw Error(body.message);
      setTickets(body)
    };
    effectFunctionTickets() 
  }, []);

  useEffect(() => {
    async function effectFunctionColumns(){
      const response = await fetch('/columns');
      const body = await response.json()
      if (response.status !== 200) throw Error(body.message);
      let newColumns = []
      for (let i in body){
        let curItem = body[i]
        let columnId = curItem.columnid
        let ticketId = curItem.id
        let columnIds = () => newColumns.map(x => x.id)
        if (columnIds().includes(columnId)){
          newColumns[columnId].tickets.push(ticketId)
        } else {
          if(columns[columnId]){
          newColumns.push({
            id: columnId,
            title: columns[columnId].title,
            tickets: [ticketId]
          })
        }
        }
       }
      setColumns(newColumns)
    };
    effectFunctionColumns() 
  }, []);
  const updatePersistData = (data) => {
    return
    localStorage.setItem('myData', JSON.stringify(data))
  }

  const dragStart = (e) => {
    e.dataTransfer.setData("TicketId", e.target.id)
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
    const ticketId = parseInt(e.dataTransfer.getData("TicketId"))
    const ticketName = tickets[ticketId].content
    const originId = columns.find(x => x.tickets.includes(ticketId))["id"]
    if (e.target.getAttribute("class") === "column" && e.target.id != originId){ 
      let newColumns = moveTicket(e.target.id, ticketId, ticketName, columns)
      setColumns(newColumns)
      updatePersistData(newColumns)
    }
  }

  const moveTicket = (colId, ticketId, val, columns) => {
    const newColumns = columns.map((col) => {
      // Removes ticket from origin
      if (col.tickets.includes(ticketId)){
        let srcCol = {
          id: col.id,
          title: col.title,
          tickets: col.tickets.filter(x => x != ticketId)
        }
        return srcCol
      }
      // Adds ticket to destination
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

  async function addTicket(columnId, val) {
    const response = fetch('/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([ val, false, columnId])
    })
    const body = await response;
    const bodytext = await body.text()
    console.log(bodytext)
  }

  const removeColumn = (id) => {
    const newColumns = columns.filter((column) => column.id !== id);
    setColumns(newColumns)
    updatePersistData(newColumns)
  }

  class Ticket extends React.Component {
    constructor(props){
      super(props)
      this.state={
        text: props.text,
        index: props.index,
        id: props.id,
        done: false
      }
    }

    toggleDone = () => {
      this.setState({done: !this.state.done}) 
    }

    render(){
      return (
        <div className="list-group-item"
             name={this.props.column}
             id={this.state.id}
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
        <div className="panel">
        <div className="panel-heading">
          <b>{"\xa0" + this.state.title + "\xa0\xa0\xa0"}</b>
          <Button type="button" className="pull-right" className="btn btn-danger btn-xs" onClick={() => {removeColumn(this.state.id)}}>X</Button>
        </div>
        <br/>
        <div className="list-group">
{/*           
        {this.state.items.map((item, i) => { 
          console.log(item)
          return <Ticket key={i} column={this.state.id} 
                                 index={item.id} 
                                 done={item.done} 
                                 id={item.id}
                                 text={item.content}/>
        })} */}
        </div>
        </div>
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
                                 items={column.tickets.map((id) => tickets[id - 1])} 
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
      event.preventDefault();
      if (this.state.value !== ""){
        const res = addTicket(this.state.id, this.state.value)

        // const newColumns = res[0]
        // const newTickets = res[1]
        // setColumns(newColumns)
        // setTickets(newTickets)
        // updatePersistData(newColumns)
      } 
    }

    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            <input className="tkt-input" type="text" placeholder="Add new dream :)" value={this.state.value} onChange={this.handleChange}/>
          </label>
          <input className="input-tkt-btn"type="submit" value="Submit" />
        </form>
      );
    }
  }

  async function addColumn(title){
    console.log(title)
    const response = fetch('/columns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([ title])
    })
    
    const body = await response;
    const bodytext = await body.text()
    console.log(bodytext)
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
      addColumn(this.state.value);
      event.preventDefault();
    }
  

    render() {
      return (
        <form className="column" onSubmit={this.handleSubmit}>
          <label>
            <input className="col-input" type="text" placeholder="Add new dream list" value={this.state.value} onChange={this.handleChange}/>
          </label>
          <input className="input-col-btn" type="submit" value="Submit" />
        </form>
      );
    }
  }
  return (
    <div className="container">
      <header className="display-1" id="title" >Hacker Dreams</header>
      <p className="lead">Don't let your dreams be dreams, hackers.</p>
      <Workspace columns={columns} tickets={tickets}/>
      <TestPage />
    </div> )
}


export default Home;