'use client';

import { useEffect, useState } from 'react';
import CardList from '../Posts/CardList';

interface ITodo {
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

interface TodoListClientProps {
    initialTodos: ITodo[];
}

const TodoListClient = ({ initialTodos }: TodoListClientProps) => {
    const [loading, setLoading] = useState(false);
    const [todos, setTodos] = useState<ITodo[]>(initialTodos);
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoDescription, setNewTodoDescription] = useState('');

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/todos', {
                cache: 'no-store'
            });
            const data = await response.json();
            setTodos(Array.isArray(data) ? data : (data.Data || []));
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
        setLoading(false);
    }

    const addTodo = async () => {
        if (!newTodoTitle.trim()) return;
        
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTodoTitle,
                    description: newTodoDescription,
                    completed: false
                })
            });
            
            if (response.ok) {
                setNewTodoTitle('');
                setNewTodoDescription('');
                fetchTodos();
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    useEffect(() => {
        fetchTodos();
        
        // Auto refresh every 5 seconds
        const interval = setInterval(() => {
            fetchTodos();
        }, 5000);
        
        return () => clearInterval(interval);
    }, []);

    if (loading && todos.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl">Loading todos...</p>
            </div>
        );
    }
    // Filter todos based on selected filter
    const filteredTodos = todos.filter(todo => {
        if (filter === 'completed') return todo.completed;
        if (filter === 'pending') return !todo.completed;
        return true;
    });

    // Add new todo handler
    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        addTodo();
    };

    // Toggle complete status
    const handleToggleComplete = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !currentStatus })
            });

            if (response.ok) {
                setTodos(todos.map(todo => 
                    todo._id === id ? { ...todo, completed: !currentStatus } : todo
                ));
            }
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    };

    // Delete todo
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this todo?')) return;
        
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setTodos(todos.filter(todo => todo._id !== id));
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <>
            {/* Add Todo Form */}
            <form onSubmit={handleAddTodo} className="mb-6 bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        placeholder="Add new todo title..."
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                        required
                    />
                    <input
                        type="text"
                        value={newTodoDescription}
                        onChange={(e) => setNewTodoDescription(e.target.value)}
                        placeholder="Description (optional)..."
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-colors font-semibold"
                    >
                        Add Todo
                    </button>
                </div>
            </form>

            {/* Filter Buttons */}
            <div className="mb-6 flex gap-3">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        filter === 'all'
                            ? 'bg-fuchsia-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    All ({todos.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        filter === 'pending'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Pending ({todos.filter(t => !t.completed).length})
                </button>
                <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        filter === 'completed'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Completed ({todos.filter(t => t.completed).length})
                </button>
            </div>

            {/* Todo List */}
            <CardList>
                {filteredTodos.map((todo) => (
                    <div key={todo._id} className="rounded overflow-hidden shadow-lg bg-white p-4 hover:shadow-xl transition-shadow">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleToggleComplete(todo._id, todo.completed)}
                                className="mt-1 w-5 h-5 cursor-pointer"
                            />
                            <div className="flex-1">
                                <h3 className={`font-semibold text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                    {todo.title}
                                </h3>
                                {todo.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {todo.description}
                                    </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(todo.createdAt).toLocaleDateString()} {new Date(todo.createdAt).toLocaleTimeString()}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                        todo.completed
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {todo.completed ? 'Completed' : 'Pending'}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(todo._id)}
                                        className="ml-auto px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </CardList>

            {filteredTodos.length === 0 && (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                    <p className="text-gray-500 text-lg">No todos found in this category</p>
                </div>
            )}
        </>
    );
};

export default TodoListClient;
