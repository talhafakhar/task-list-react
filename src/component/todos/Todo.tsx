import React, {useState} from "react";
import {Button, Checkbox, TextInput} from "flowbite-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {TodoInterface} from "../task/TaskList";
import axios from "axios";
import {apiRoutes} from "../../routes";
import {toast} from "react-toastify";

interface TodoProps {
    todo: TodoInterface;
    taskListId: string
    onSuccess: () => void;
}

export const Todo: React.FC<TodoProps> = ({todo, onSuccess, taskListId}) => {
    const [description, setDescription] = useState(todo.description);
    const [status, setStatus] = useState(todo.status);
    const handleDeleteTodo = async () => {
        try {
            await axios.delete(apiRoutes.DELETE_TODO(taskListId, todo.id));
            toast.success('Todo deleted successfully.');
            onSuccess();
        } catch (error) {
            toast.error('Failed to delete todo.');
        }
    };
    const handleToggleTodo = async () => {
        const updatedStatus = status === 'completed' ? 'pending' : 'completed';
        try {
            await axios.put(apiRoutes.UPDATE_TODO(taskListId, todo.id), {
                status: updatedStatus,
                description,
            });
            setStatus(updatedStatus);
            toast.success('Todo updated successfully.');
            onSuccess();
        } catch (error) {
            toast.error('Failed to update todo.');
        }
    };
    const handleEditTodo = async () => {
        try {
            await axios.put(apiRoutes.UPDATE_TODO(taskListId, todo.id), {description});
            toast.success('Todo updated successfully.');
            onSuccess();
        } catch (error) {
            toast.error('Failed to update todo.');
        }
    };
    return (
        <ul>
            <li key={todo.id} className="flex items-center space-x-2 mb-2">
                <Checkbox
                    checked={status === 'completed'}
                    onChange={handleToggleTodo}
                />
                <TextInput
                    type="text"
                    disabled={status === 'completed'}
                    value={description}
                    className={`flex-grow ${status === 'completed' ? 'line-through text-gray-500' : ''}`}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={handleEditTodo}
                />
                <Button color="failure" size="sm" onClick={() => handleDeleteTodo()}>
                    <FontAwesomeIcon icon={faTrash}/>
                </Button>
            </li>
        </ul>

    );
};
