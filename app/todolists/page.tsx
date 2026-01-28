import TodoListClient from '../components/TodoList/TodoListClient';

interface ITodo {
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

const TodoListsPage = async () => {
    return (
        <>
            <h1 className="text-fuchsia-500 text-3xl font-bold mb-6">Todo Lists</h1>
            <TodoListClient initialTodos={[]} />
        </>
    );
} 

export default TodoListsPage;