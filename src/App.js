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
    const [currentEdit,setCurrentEdit] = useState(null);
    const [currentEditedItem,setCurrentEditedItem] = useState({});
    const [userId, setUserId] = useState(1);

    useEffect(() => {
        fetch(`https://my-json-server.typicode.com/AlexTiplea20/todo/todos?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched todos: ", data);
                const incompleteTodos = data.filter(todo => !todo.completed);
                const completeTodos = data.filter(todo => todo.completed);
                setTodos(incompleteTodos);
                setCompletedTodos(completeTodos);
            })
            .catch(error => console.error('Error fetching todos', error));
    }, [userId]);

    const handleAddTodo = () => {
        let newTodoItem = {
            userId,
            title: newTitle,
            description: newDescription,
            completed: false
        };

        fetch('https://my-json-server.typicode.com/AlexTiplea20/todo/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTodoItem)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Added new todo: ", data);
                setTodos([...allToDos, data]);
                setNewTitle("");
                setNewDescription("");
            })
            .catch(error => console.error('Error adding todo:', error));
    };

    const handleDeleteTodo = index => {
        const todoToDelete = allToDos[index];
        fetch(`https://my-json-server.typicode.com/AlexTiplea20/todo/todos/${todoToDelete.id}`, {
            method: 'DELETE'
        })
            .then(() => {
                const updatedTodos = [...allToDos];
                updatedTodos.splice(index, 1);
                setTodos(updatedTodos);
            })
            .catch(error => console.error('Error deleting todo:', error));
    };

    const handleComplete = index => {
        const now = new Date();
        const completedOn = now.toISOString(); // Ensure the date is in ISO format
        const todoToComplete = allToDos[index];
        const updatedTodo = { ...todoToComplete, completed: true, completedOn };

        fetch(`https://my-json-server.typicode.com/AlexTiplea20/todo/todos/${todoToComplete.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTodo)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Completed todo:", data);
                const updatedTodos = [...allToDos];
                updatedTodos.splice(index, 1);
                setCompletedTodos([...completedTodos, data]);
                setTodos(updatedTodos);
            })
            .catch(error => console.error('Error completing todo:', error));
    };

    const handleDeleteCompletedTodo = index => {
        const todoToDelete = completedTodos[index];
        fetch(`https://my-json-server.typicode.com/AlexTiplea20/todo/todos/${todoToDelete.id}`, {
            method: 'DELETE'
        })
            .then(() => {
                const updatedCompletedTodos = [...completedTodos];
                updatedCompletedTodos.splice(index, 1);
                setCompletedTodos(updatedCompletedTodos);
            })
            .catch(error => console.error('Error deleting completed todo:', error));
    };

    const handleEdit = (index, item) => {
        setCurrentEdit(index);
        setCurrentEditedItem(item);
    };

    const handleUpdateTitle = value => {
        setCurrentEditedItem(prev => ({ ...prev, title: value }));
    };

    const handleUpdateDescription = value => {
        setCurrentEditedItem(prev => ({ ...prev, description: value }));
    };

    const handleUpdateToDo = () => {
        const updatedTodo = { ...currentEditedItem };
        fetch(`https://my-json-server.typicode.com/AlexTiplea20/todo/todos/${currentEditedItem.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTodo)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Updated todo: ", data);
                const updatedTodos = [...allToDos];
                updatedTodos[currentEdit] = data;
                setTodos(updatedTodos);
                setCurrentEdit(null);
            })
            .catch(error => console.error('Error updating todo:', error));
    };

    return (
        <div className="App">
            <h1>My Todos</h1>

            <div className='user-filter'>
                <label>Select User: </label>
                <select value ={userId} onChange={(e) => setUserId(Number(e.target.value))}>
                    <option value={1}>User 1</option>
                    <option value={2}>User 2</option>
                    <option value={3}>User 3</option>
                    <option value={4}>User 4</option> {/* Test for no output for this user */}
                </select>
            </div>

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
                        const completedDate = item.completedOn ? new Date(item.completedOn).toLocaleDateString() : "N/A";
                        return(
                            <div className='todo-list-item' key ={index}>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <p><small>Completed on: {completedDate}</small></p>
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
