'use client';

import { useState } from 'react';
import CardList from '../Posts/CardList';

interface ITodo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

interface TodoListClientProps {
    initialTodos: ITodo[];
}

const TodoListClient = ({ initialTodos }: TodoListClientProps) => {
    const [todos, setTodos] = useState<ITodo[]>(initialTodos);
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
    const [newTodoTitle, setNewTodoTitle] = useState('');

    // Filter todos based on selected filter
    const filteredTodos = todos.filter(todo => {
        if (filter === 'completed') return todo.completed;
        if (filter === 'pending') return !todo.completed;
        return true;
    });

    // Add new todo
    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodoTitle.trim()) return;

        const newTodo: ITodo = {
            userId: 1,
            id: Math.max(...todos.map(t => t.id), 0) + 1,
            title: newTodoTitle,
            completed: false
        };

        setTodos([newTodo, ...todos]);
        setNewTodoTitle('');
    };

    // Toggle complete status
    const handleToggleComplete = (id: number) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    // Delete todo
    const handleDelete = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <>
            {/* Add Todo Form */}
            <form onSubmit={handleAddTodo} className="mb-6 bg-white p-6 rounded-lg shadow-md">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        placeholder="Add new todo..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
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
                    <div key={todo.id} className="rounded overflow-hidden shadow-lg bg-white p-4 hover:shadow-xl transition-shadow">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleToggleComplete(todo.id)}
                                className="mt-1 w-5 h-5 cursor-pointer"
                            />
                            <div className="flex-1">
                                <h3 className={`font-semibold text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                    {todo.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    User ID: {todo.userId} | ID: {todo.id}
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
                                        onClick={() => handleDelete(todo.id)}
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
