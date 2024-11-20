import React, {useEffect, useState} from 'react';
import {Nav} from "../../component/header/Navbar";
import {TaskListCard} from "../../component/task/TaskList";
import {useHandleErrorResponse, useHandleSuccessResponse} from "../../hook/HandleApiResponse";
import axios from "axios";
import {apiRoutes} from "../../routes";
import {AddInput} from "../../component/forms/AddInput";
import {Loader} from "../../component/loader/Loader";

export interface Task {
    id: string;
    title: string;
    is_own: boolean;
}

interface TaskListResponse {
    data: Task[];
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

const TaskList: React.FC = () => {
    const handleSuccessResponse = useHandleSuccessResponse();
    const handleErrorResponse = useHandleErrorResponse();
    const [taskList, setTaskList] = useState<TaskListResponse>();
    const [loading, setLoading] = useState(false);
    const fetchTaskLists = async () => {
        setLoading(true);
        await axios.get(apiRoutes.TASK_LIST)
            .then((res) => {
                handleSuccessResponse(res);
                setTaskList(res.data);
            }).catch((error) => {
                handleErrorResponse(error);
            }).finally(() => {
                setLoading(false);
            })
    }
    useEffect(() => {
        fetchTaskLists();
    }, []);


    return (
        <>
            <Nav/>
            <main>
                <div className="text-center mt-10"><h1
                    className="title text-4xl md:text-5xl lg:text-6xl font-bold text-white whitespace-nowrap overflow-hidden p-5">Today
                    I need to.</h1></div>
                <div className="flex justify-center items-center">
                    <AddInput
                        url={apiRoutes.TASK_LIST}
                        onSuccess={() => fetchTaskLists()}
                        type={'taskList'}
                        placeholder={'Add Task List'}
                    />
                </div>
            </main>
            <div className="mt-10">
                {loading ? (
                    <Loader/>
                ) : (
                    taskList?.data?.map((task) => (
                        <TaskListCard
                            key={task.id}
                            task={task}
                            onSuccess={() => {
                                fetchTaskLists();
                            }}
                        />
                    ))
                )}
            </div>
        </>
    );
}

export default TaskList;