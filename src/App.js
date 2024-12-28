import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [addTask, setAddTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    // Retrieve tasks from localStorage on initial render
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [isEditing, setIsEditing] = useState(null);
  const [editedTask, setEditedTask] = useState('');

  useEffect(() => {
    // Update localStorage whenever tasks state changes
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => setAddTask(e.target.value);

  const handleAddTask = () => {
    if (addTask.trim()) {
      setTasks([...tasks, { text: addTask, completed: false }]);
      setAddTask('');
    }
  };

  const handleEdit = (index) => {
    setIsEditing(index);
    setEditedTask(tasks[index].text);
  };

  const handleSaveEdit = (index) => {
    if (editedTask.trim()) {
      const updatedTasks = tasks.map((task, i) =>
        i === index ? { ...task, text: editedTask } : task
      );
      setTasks(updatedTasks);
      setIsEditing(null);
      setEditedTask('');
    }
  };

  const handleEditChange = (e) => setEditedTask(e.target.value);

  const handleRemove = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleComplete = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="p-6 flex items-center justify-center">
      <div className="flex flex-col w-full max-w-lg bg-gray-700 border-slate-300 border-solid border-2 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">To-Do App</h1>

        <div className="w-full flex flex-col">
          <div className="flex flex-col sm:flex-row mb-4">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none mb-2 sm:mb-0"
              placeholder="Add a new task"
              value={addTask}
              onChange={handleChange}
            />
            <button
              onClick={handleAddTask}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg sm:rounded-r-lg sm:rounded-l-none hover:bg-orange-600"
            >
              Add
            </button>
          </div>

          {tasks.length > 0 && (
            <h2 className="text-center text-xl font-bold text-white mb-6">Your To-Do List</h2>
          )}


          <ul className="space-y-2">
            {tasks.map((task, i) => (
              <li
                key={i}
                className={`flex justify-between items-center px-4 py-2 bg-slate-500 rounded-lg shadow ${task.completed && isEditing !== i ? 'line-through text-gray-100' : ''
                  }`}
              >
                {isEditing === i ? (
                  <input
                    type="text"
                    placeholder="Edit your task"
                    value={editedTask}
                    onChange={handleEditChange}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
                  />
                ) : (
                  <>
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
                    <span className={`flex-1 ml-2 text-white`}>{task.text}</span>
                  </>
                )}

                <div className="flex items-center space-x-4">
                  <button
                    className="ml-2 font-bold"
                    onClick={() =>
                      isEditing === i ? handleSaveEdit(i) : handleEdit(i)
                    }
                  >
                    {isEditing === i ? (
                      <div className="text-green-500 hover:text-green-600">
                        <span>Save</span>
                        <i className="fa-solid fa-save ml-2"></i>
                      </div>
                    ) : (
                      <i className="fa-solid fa-pen-to-square text-slate-50 hover:text-slate-300"></i>
                    )}
                  </button>

                  {isEditing !== i && (
                    <button
                      className="text-red-700 hover:text-red-800 ml-2 font-bold"
                      onClick={() => handleRemove(i)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
