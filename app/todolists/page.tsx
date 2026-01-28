import TodoListClient from '../components/TodoList/TodoListClient';

const base_url = "https://jsonplaceholder.typicode.com/todos";

interface ITodo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

const TodoListsPage = async () => {
    const response = await fetch(base_url, {
        cache: 'no-store'
    });
    const todos: ITodo[] = await response.json();

    return (
        <>
            <h1 className="text-fuchsia-500 text-3xl font-bold mb-6">Todo Lists</h1>
            <TodoListClient initialTodos={todos} />
        </>
    );
} 

export default TodoListsPage;