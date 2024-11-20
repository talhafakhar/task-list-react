import React, {useState} from "react";
import {Button, Checkbox, TextInput, Tooltip} from "flowbite-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {TodoInterface} from "../task/TaskList";
import axios from "axios";
import {apiRoutes} from "../../routes";
import {ClipLoader} from 'react-spinners';
import {useHandleErrorResponse, useHandleSuccessResponse} from "../../hook/HandleApiResponse";

interface TodoProps {
    todo: TodoInterface;
    taskListId: string
    onSuccess: () => void;
}

export const Todo: React.FC<TodoProps> = ({todo, onSuccess, taskListId}) => {
    const [description, setDescription] = useState(todo.description);
    const [status, setStatus] = useState(todo.status);
    const [loading, setLoading] = useState(false);
    const handleSuccessResponse = useHandleSuccessResponse();
    const handleErrorResponse = useHandleErrorResponse();

    const handleDeleteTodo = async () => {
        setLoading(true);
        await axios.delete(apiRoutes.DELETE_TODO(taskListId, todo.id))
            .then((res) => {
                handleSuccessResponse(res);
                onSuccess();
            }).catch((error) => {
                handleErrorResponse(error);
            }).finally(() => {
                setLoading(false);
            })
    };
    const handleToggleTodo = async () => {
        const updatedStatus = status === 'completed' ? 'pending' : 'completed';
        await axios.put(apiRoutes.UPDATE_TODO(taskListId, todo.id), {
                status: updatedStatus,
                description,
        })
            .then((res) => {
                handleSuccessResponse(res);
                setStatus(updatedStatus);
                onSuccess();
            }).catch((error) => {
                handleErrorResponse(error);
            })
    };
    const handleEditTodo = async () => {
        await axios.put(apiRoutes.UPDATE_TODO(taskListId, todo.id), {description})
            .then((res) => {
                handleSuccessResponse(res);
                onSuccess();
            }).catch((error) => {
                handleErrorResponse(error);
            })
    };
    return (
        <ul>
            <li key={todo.id} className="flex items-center space-x-2 mb-2">
                <Tooltip content={status === 'completed' ? 'Mark as pending' : 'Mark as completed'}>
                    <Checkbox
                        checked={status === 'completed'}
                        onChange={handleToggleTodo}
                    />
                </Tooltip>
                <TextInput
                    type="text"
                    disabled={status === 'completed'}
                    value={description}
                    className={`flex-grow ${status === 'completed' ? 'line-through text-gray-500' : ''}`}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={handleEditTodo}
                />
                <Tooltip content='Delete'>
                    <Button
                        color="failure"
                        size="sm"
                        onClick={handleDeleteTodo}
                        disabled={loading}
                    >
                        {loading ? (
                            <ClipLoader color="#fff" size={20}/>
                        ) : (
                            <FontAwesomeIcon icon={faTrash}/>
                        )}
                    </Button>
                </Tooltip>

            </li>
        </ul>

    );
};
