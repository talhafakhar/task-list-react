import {Button, Modal} from "flowbite-react";
import React, {useEffect, useState} from "react";
import {apiRoutes} from "../../routes";
import {toast} from "react-toastify";
import axios from "axios";
import {useHandleErrorResponse, useHandleSuccessResponse} from "../../hook/HandleApiResponse";
import MultiSelect from "../forms/MultiSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    task: { id: string, is_own: boolean };
}

interface SharedWithInterface {
    id: string;
    permission: string;
    user: {
        id: string;
        username: string;
    },
    created_at: string;
    updated_at: string;
}

export const TaskSharedModal: React.FC<ModalProps> = ({open, setOpen, task}) => {
    const handleSuccessResponse = useHandleSuccessResponse();
    const handleErrorResponse = useHandleErrorResponse();
    const [sharedUsers, setSharedUsers] = useState<SharedWithInterface[]>([]);
    const fetchSharedUsers = async () => {
        if (task.is_own) {
            await axios.get(apiRoutes.SHARED_WITH(task.id))
                .then((res) => {
                    handleSuccessResponse(res);
                    setSharedUsers(res.data.data);
                }).catch((error) => {
                    handleErrorResponse(error);
                });
        }
    }
    useEffect(() => {
        fetchSharedUsers();
    }, []);
    const handleMultiSelectSubmit = (selectedItems: string[], permission: string) => {
        if (selectedItems.length === 0) {
            toast("Please select a user to share the task list with.");
            return;
        }

        axios.post(apiRoutes.SHARE_TASK_LIST(task.id), {
            users: selectedItems,
            permission: permission,
        }).then((response) => {
            handleSuccessResponse(response);
            fetchSharedUsers();
        }).catch((error) => {
            handleErrorResponse(error);
        });
    };
    const handleUpdatePermission = async (user: SharedWithInterface, permission: string) => {
        axios.put(apiRoutes.UPDATE_PERMISSION(task.id), {
            permission: permission,
            user_id: user.user.id
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(() => {
                toast.success('Permission updated successfully');
                fetchSharedUsers();
            })
            .catch((error) => {
                console.error("Error updating permission:", error);
            });
    };
    const handleUnshare = async (userId: string) => {
        axios.post(apiRoutes.UNSHARE_TASK_LIST(task.id), {
            users: [userId]
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(() => {
                toast.success('Task unshared successfully');
                fetchSharedUsers();
            })
            .catch((error) => {
                console.error("Error Un-Sharing task:", error);
            });
    };
    return (
        <Modal show={open} onClose={() => setOpen(false)}>
            <Modal.Header>Share Your Task List</Modal.Header>
            <Modal.Body>
                <div className="space-y-4">
                    <MultiSelect
                        apiRoute={apiRoutes.CHECK_USERNAME(":username")}
                        onSubmit={handleMultiSelectSubmit}
                    />
                    <h3 className="text-lg font-medium mt-4 text-blue-600">Shared with</h3>

                    <ul className="space-y-2">
                        {sharedUsers.map((user) => (
                            <li
                                key={user.user.username}
                                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4"
                            >
                                <span className="text-gray-700 text-sm md:text-base font-medium">
      {user.user.username}
    </span>
                                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                                    <select
                                        className="text-sm md:text-base bg-white text-gray-700 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={user.permission}
                                        onChange={(e) => handleUpdatePermission(user, e.target.value)}
                                    >
                                        <option value="view">View</option>
                                        <option value="edit">Edit</option>
                                    </select>
                                    <Button
                                        color="failure"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={() => handleUnshare(user.user.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </Button>
                                </div>
                            </li>
                        ))}
                        {sharedUsers.length === 0 && (
                            <p className="text-red-500">Not shared with anyone</p>
                        )}
                    </ul>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button>Done</Button>
            </Modal.Footer>
        </Modal>
    );
}
