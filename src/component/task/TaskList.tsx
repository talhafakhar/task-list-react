import React, {useEffect, useState} from "react";
import {Task} from "../../pages/taskList/TaskList";
import {TaskHeader} from "./TaskHeader";
import {Card} from "flowbite-react";
import {apiRoutes} from "../../routes";
import axios from "axios";
import {useHandleErrorResponse, useHandleSuccessResponse} from "../../hook/HandleApiResponse";
import {AddInput} from "../forms/AddInput";
import {Todo} from "../todos/Todo";
import {Loader} from "../loader/Loader";

interface TaskCardProps {
    task: Task;
    onSuccess: () => void;
}

export interface TodoInterface {
    id: string;
    description: string;
    status: string;
    created_at: string;
}

interface TodoListResponse {
    data: TodoInterface[];
    links: {
        first: string;
        last: string;
        prev: string;
        next: string;
    },
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[],
    }
}

export const TaskListCard: React.FC<TaskCardProps> = ({task, onSuccess}) => {
    const [todoList, setTodoList] = useState<TodoListResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const handleSuccessResponse = useHandleSuccessResponse()
    const handleErrorResponse = useHandleErrorResponse();
    const fetchTodoList = async () => {
        await axios.get(apiRoutes.TODO_LIST(task.id))
            .then((res) => {
                handleSuccessResponse(res);
                setTodoList(res.data);
            }).catch((error) => {
                handleErrorResponse(error);
            })
    }
    useEffect(() => {
        fetchTodoList()
    }, []);
    const handleAddTodo = async () => {
        setIsLoading(true);
        try {
            await fetchTodoList();
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="w-full max-w-sm mx-auto mt-4">
            <div>
                <Card>
                    <TaskHeader onSuccess={onSuccess} task={task}/>
                    <div className="relative">
                        {isLoading && (
                            <div className="absolute inset-0 flex justify-center items-center z-10">
                                <div
                                    className="p-2 bg-white border border-gray-500 flex justify-center items-center rounded-lg">
                                    <Loader/>
                                </div>
                            </div>
                        )}
                        {todoList?.data.map((todo) => (
                            <Todo
                                onSuccess={handleAddTodo}
                                taskListId={task.id}
                                key={todo.id}
                                todo={todo}
                            />
                        ))}
                        <AddInput
                            url={apiRoutes.CREATE_TODO(task.id)}
                            onSuccess={handleAddTodo}
                            type="task"
                            placeholder="Add Todo"
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};
