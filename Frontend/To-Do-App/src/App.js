import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [addTask, setAddTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedTask, setEditedTask] = useState('');

  const API_URL = 'https://to-do-app-mern-project.onrender.com/api/todos';

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (addTask.trim()) {
      try {
        const response = await axios.post(API_URL, {
          text: addTask,  // Use `text` instead of `title` to match backend model
          completed: false,
        });
        setTasks([...tasks, response.data]);
        setAddTask('');
        toast.success('Task added successfully!');
      } catch (error) {
        toast.error('Failed to add task.');
      }
    } else {
      toast.warn('Task cannot be empty.');
    }
  };

  const handleEdit = (index) => {
    setIsEditing(index);
    setEditedTask(tasks[index].text);  // Use `text` here instead of `title`
  };

  const handleSaveEdit = async (index) => {
    const taskId = tasks[index]._id;

    if (!editedTask.trim()) {
      toast.warn('Task cannot be empty.');
      return;
    }

    try {
      await axios.put(`${API_URL}/${taskId}`, {
        text: editedTask.trim(),  // Use `text` here instead of `title`
        completed: tasks[index].completed,
      });

      await fetchTasks();

      setIsEditing(null);
      setEditedTask('');
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update task.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedTask('');
  };

  const handleRemove = async (index) => {
    const taskId = tasks[index]._id;
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      setTasks(tasks.filter((_, i) => i !== index));
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task.');
    }
  };

  const handleComplete = async (index) => {
    const task = tasks[index];
    try {
      const response = await axios.put(`${API_URL}/${task._id}`, {
        text: task.text,  // Use `text` here
        completed: !task.completed,
      });

      const updatedTasks = [...tasks];
      updatedTasks[index] = response.data;
      setTasks(updatedTasks);
      toast.success('Task status updated!');
    } catch (error) {
      toast.error('Failed to update task status.');
    }
  };

  return (
    <div className="p-6 flex items-center justify-center">
      <div className="flex flex-col w-full max-w-lg bg-gray-700 border-slate-300 border-solid border-2 rounded-lg p-6">
        <div className='w-full flex flex-row items-center justify-center gap-5 mb-6'>
          <img className='rounded-full' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShrMeWMtU7lXZB6CBj6ReBS6Iyyfch6ubZQQ&s' alt='Logo' height={"70px"} width={"70px"} />
          <h1 className="text-3xl font-bold text-white text-center">To-Do App</h1>
        </div>

        <div className="w-full flex flex-col">
          <div className="flex flex-col sm:flex-row mb-4">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none mb-2 sm:mb-0 text-center sm:text-left"
              placeholder="Add a new task"
              value={addTask}
              onChange={(e) => setAddTask(e.target.value)}
            />
            <button
              onClick={handleAddTask}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg sm:rounded-r-lg sm:rounded-l-none hover:bg-orange-600"
            >
              Add
            </button>
          </div>

          {tasks.length > 0 && (
            <div className='w-full flex flex-row items-center justify-center gap-2 mt-6 mb-6'>
              <img className='rounded-full' src='https://img.freepik.com/premium-vector/todo-app-logo-icon_1076610-65917.jpg' alt='todo-list' height={"40px"} width={"40px"} />
              <h2 className="text-center text-xl font-bold text-white">Your To-Do List</h2>
            </div>
          )}

          <ul className="space-y-2">
            {tasks.map((task, i) => (
              <li
                key={task._id}
                className={`flex flex-wrap justify-between items-center px-4 py-2 rounded-lg shadow ${task.completed ? 'bg-gray-400 line-through text-gray-100' : 'bg-slate-500'
                  }`}
              >
                {isEditing === i ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-2">
                    <input
                      type="text"
                      value={editedTask}
                      onChange={(e) => setEditedTask(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(i)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Update
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 flex items-center">
                      <button
                        className="ml-2 font-bold"
                        onClick={() => handleComplete(i)}
                      >
                        {task.completed ? (
                          <i className="fa-solid fa-circle-check text-orange-500 hover:text-orange-600"></i>
                        ) : (
                          <i className="fa-solid fa-circle text-white"></i>
                        )}
                      </button>
                      <span className={`ml-2 ${task.completed ? 'text-gray-300' : 'text-white'}`}>
                        {task.text}  {/* Use task.text here */}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 ml-4">
                      <button
                        className={`font-bold ${task.completed
                          ? 'text-gray-400 cursor-not-allowed pointer-events-none'
                          : 'text-slate-50 hover:text-slate-300'
                          }`}
                        onClick={() => handleEdit(i)}
                        disabled={task.completed}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>

                      <button
                        className="text-red-700 hover:text-red-800 font-bold"
                        onClick={() => handleRemove(i)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
