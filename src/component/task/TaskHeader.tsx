import React, {useState} from "react";
import {Button, TextInput} from "flowbite-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faEdit, faShare, faTrash} from "@fortawesome/free-solid-svg-icons";
import {TaskSharedModal} from "../modal/TaskSharedModal";
import axios from "axios";
import {apiRoutes} from "../../routes";
import {toast} from "react-toastify";

interface TaskHeaderProps {
    task: {
        id: string;
        title: string;
        is_own: boolean;
    };
    onSuccess: () => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({task, onSuccess}) => {
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);

    const handleDeleteTaskList = async () => {
        try {
            await axios.delete(apiRoutes.DELETE_TASK_LIST(task.id));
            toast.success('Task List deleted successfully.');
            onSuccess();
        } catch (error) {
            toast.error('Failed to delete Task List.');
        }
    };

    const handleUpdateTitle = async () => {
        try {
            await axios.put(apiRoutes.UPDATE_TASK_LIST(task.id), {title: newTitle});
            toast.success('Task List title updated successfully.');
            setIsEditing(false);
            onSuccess();
        } catch (error) {
            toast.error('Failed to update Task List title.');
        }
    };

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
                {isEditing ? (
                    <TextInput
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                ) : (
                    <h2 className="text-xl font-bold">{task.title}</h2>
                )}
                <Button
                    color="gray"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    <FontAwesomeIcon icon={isEditing ? faArrowLeft : faEdit}/>
                </Button>
            </div>
            <div className="flex space-x-1 ms-1">
                <Button onClick={handleDeleteTaskList} color="failure" size="sm">
                    <FontAwesomeIcon icon={faTrash}/>
                </Button>
                <Button color="blue" size="sm" onClick={() => setOpenModal(true)}>
                    <FontAwesomeIcon icon={faShare}/>
                </Button>
                <TaskSharedModal task={task} open={openModal} setOpen={setOpenModal}/>
                {isEditing && (
                    <Button onClick={handleUpdateTitle} color="success" size="sm">
                        <FontAwesomeIcon icon={faEdit}/>
                    </Button>
                )}
            </div>
        </div>
    );
};
