//import logo from './logo.svg';

//Import la librariile necesare pentru React
import React,{ useState,useEffect } from 'react';       
import './App.css';                                                 //Fisierul de CSS pentru aplicatie
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';    //Import pentru ICON-uile de delete si edit
import { BsCheckLg } from 'react-icons/bs';                         //Import pentru ICON-ul de completed

function App() {

  //Crearea variabilelor
  const [isCompleteScreen,setIsCompleteScreen] = useState(false);
  const [allToDos,setTodos] = useState([]);
  const [newTitle,setNewTitle] = useState(" ");
  const [newDescription,setNewDescription] = useState(" ");
  const [completedTodos,setCompletedTodos] = useState([]);
  const [currentEdit,setCurrentEdit] = useState(" ");
  const [currentEditedItem,setcurrentEditedItem] = useState("");

  //Adaugarea unui nou task
  const handleAddTodo = () => {
    let newTodoItem = {
      title:newTitle,
      description:newDescription,
    };

    let updateTodoArr = [...allToDos];
    updateTodoArr.push(newTodoItem);
    setTodos(updateTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updateTodoArr))
  };

  //Stergerea unui task
  const handleDeleteTodo = index => {
    let reducedTodo = [...allToDos];
    reducedTodo.splice (index, 1);

    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos (reducedTodo);
  };

  //Marcarea unui task ca fiind completat, precizand data si ora cand acesta a fost completat
  const handleComplete = index => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...allToDos[index],
      completedOn:completedOn,
    };

    let updateCompletedArr = [...completedTodos];
    updateCompletedArr.push (filteredItem);
    setCompletedTodos (updateCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem('completedTodos', JSON.stringify(updateCompletedArr));
  };

  //Stergerea unui task deja completat
  const handleDeleteCompletedTodo = index =>{
    let reducedTodo = [...completedTodos];
    reducedTodo.splice (index,1);

    localStorage.setItem ('completedTodos', JSON.stringify(reducedTodo));
    setCompletedTodos (reducedTodo);
  }

  //Incarcarea si stocarea task-urilor locak
  useEffect(()=>{
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if(savedTodo){
      setTodos(savedTodo);
    }

    if(savedCompletedTodo){
      setCompletedTodos(savedCompletedTodo);
    }
  },[]);
  
  //Pentru butonul de editare
  const handleEdit = (ind,item)=>{
    console.log(ind);
    setCurrentEdit(ind);
    setcurrentEditedItem(item);
  }

  //Pentru modificarea campului "Title"
  const handleUpdateTitle = (value)=>{
    setcurrentEditedItem((prev)=>{
      return{...prev,title:value}
    })
  }

  //Pentru modificarea campului "Description"
  const handleUpdateDescription = (value)=>{
    setcurrentEditedItem((prev)=>{
      return{...prev,description:value}
    })
  }

  //Salvarea noului Title si a descrierii
  const handleUpdateToDo = ()=>{
    let newToDo = [...allToDos];
    newToDo[currentEdit] = currentEditedItem;
    setTodos(newToDo);
    setCurrentEdit("");
  }

  return (
    <div className="App">
      <h1>My Todos</h1>

      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input type="text" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="What's the task title"/>
          </div>
          <div className='todo-input-item'>
            <label>Description</label>
            <input type="text" value={newDescription} onChange={(e)=>setNewDescription(e.target.value)} placeholder="What's the task title"/>
          </div>
          <div className='todo-input-item'>
            <button type='button' onClick={handleAddTodo} className='primaryBtn'>Add</button>
          </div>
        </div>

        <div className='btn-area'>
          <button className={`secondaryBtn ${isCompleteScreen===false && 'active'}`} onClick={()=>setIsCompleteScreen(false)}>Todo</button>
          <button className={`secondaryBtn ${isCompleteScreen===true && 'active'}`} onClick={()=>setIsCompleteScreen(true)}>Completed</button>
        </div>
        
        <div className='todo-list'>
          
        {isCompleteScreen===false && allToDos.map((item, index) => {
          if (currentEdit === index ){
              return(
                <div className='edit_wrapper' key={index}>
                  <input placeholder='Update Title' 
                  onChange={(e)=>handleUpdateTitle(e.target.value)} 
                  value={currentEditedItem.title} />
                  <textarea placeholder='Update Description'
                  rows={4}
                  onChange={(e)=>handleUpdateDescription(e.target.value)} 
                  value={currentEditedItem.description} />
                  <button type='button' onClick={handleUpdateToDo} className='primaryBtn'>
                    Update
                  </button>
                </div>
              )
          }else{
            return(
              <div className='todo-list-item' key ={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div>
                  <AiOutlineDelete className='icon' 
                  onClick={()=>handleDeleteTodo(index)} 
                  title="Delete?"/>
                  <BsCheckLg className='check-icon' 
                  onClick ={()=>handleComplete(index)} 
                  title="Complete?"/>
                  <AiOutlineEdit className='check-icon' 
                  onClick ={()=>handleEdit(index,item)} 
                  title="Edit?" />
                </div>
              </div>
            )
          }
              
         })}

        {isCompleteScreen === true && completedTodos.map((item,index)=>{
              return(
                <div className='todo-list-item' key ={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed on: {item.completedOn}</small></p>
                  </div>
                  <div>
                    <AiOutlineDelete className='icon' onClick={()=>handleDeleteCompletedTodo(index)} title="Delete?"/>
                  </div>
                </div>
              )
         })}

        </div>

      </div>
    </div>
  );
}

export default App;
