import React, {useState} from "react";
import {Button, TextInput, Tooltip} from "flowbite-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faEdit, faLink, faShare, faTrash} from "@fortawesome/free-solid-svg-icons";
import {TaskSharedModal} from "../modal/TaskSharedModal";
import axios from "axios";
import {apiRoutes} from "../../routes";
import {useHandleErrorResponse, useHandleSuccessResponse} from "../../hook/HandleApiResponse";
import {Task} from "../../pages/taskList/TaskList";

interface TaskHeaderProps {
    task: Task
    onSuccess: () => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({task, onSuccess}) => {
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);
    const handleSuccessResponse = useHandleSuccessResponse();
    const handleErrorResponse = useHandleErrorResponse();
    const handleDeleteTaskList = async () => {
        await axios.delete(apiRoutes.DELETE_TASK_LIST(task.id))
            .then((res) => {
                handleSuccessResponse(res);
                onSuccess()
            }).catch((error) => {
                handleErrorResponse(error);
            })
    };
    const handleUpdateTitle = async () => {
        await axios.put(apiRoutes.UPDATE_TASK_LIST(task.id), {title: newTitle})
            .then(((res) => {
                handleSuccessResponse(res);
                onSuccess()
                setIsEditing(false);
            })).catch((error) => {
                handleErrorResponse(error);
            })
    };

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
                {task.is_shared && (
                    <span className="text-sm text-green-500 "><FontAwesomeIcon icon={faLink}/></span>)}
                {isEditing ? (
                    <TextInput
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                ) : (
                    <h2 className="text-xl font-bold"> {task.title}</h2>
                )}
                <Tooltip content={isEditing ? "Cancel Editing" : "Edit"}>
                    <Button
                        color="gray"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <FontAwesomeIcon icon={isEditing ? faArrowLeft : faEdit}/>
                    </Button>
                </Tooltip>
            </div>
            <div className="flex space-x-1 ms-1">
                <Tooltip content="Delete">
                    <Button onClick={handleDeleteTaskList} color="failure" size="sm"><FontAwesomeIcon
                        icon={faTrash}/></Button>
                </Tooltip>
                <Tooltip content="Share">
                    <Button color="blue" size="sm" onClick={() => setOpenModal(true)}><FontAwesomeIcon icon={faShare}/></Button>
                </Tooltip>
                <TaskSharedModal task={task} open={openModal} setOpen={setOpenModal}/>
                {isEditing && (
                    <Tooltip content='Update'>
                        <Button onClick={handleUpdateTitle} color="success" size="sm">
                            <FontAwesomeIcon icon={faEdit}/>
                        </Button>
                    </Tooltip>
                )}
            </div>
        </div>
    );
};
