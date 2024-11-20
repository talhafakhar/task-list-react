/*
 * Copyright (c) 2024.
 * 2BTech Inc
 */

import {AxiosResponse} from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {reactRoutes} from "../routes";

const useHandleSuccessResponse = () => {
    return (response: AxiosResponse<any, any>) => {
        if (response.data.status === 'success') {
            toast.success(response.data.message);
        } else if (response.data.status === 'warning') {
            toast.warn(response.data.message);
        } else if (response.data.status === 'error') {
            toast.error(response.data.message);
        }
        return response.data;
    };
};

const useHandleErrorResponse = () => {
    const navigate = useNavigate();
    return (error: any): any => {
        const response: AxiosResponse<any, any> = error.response;
        if (!response) {
            toast.error('Something went wrong');
            return null;
        }
        switch (response.status) {
            case 401:
                localStorage.removeItem('user');
                toast.error(response.data.message || 'Unauthorized');
                window.location.replace(reactRoutes.LOGIN);
                return (response.status)
            case 403:
                toast.error(response.data.message || 'Forbidden');
                return (response.status)
            case 404:
                toast.error('Page not found');
                navigate(reactRoutes.TASK_LIST);
                break;
            case 406:
                toast.error(response.data.message || 'Not Acceptable');
                break;
            case 422:
                if (response.data.errors) {
                    return response.data.errors;
                } else {
                    toast.error('Validation Error');
                }
                break;
            default:
                toast.error('Something went wrong');
                break;
        }
        return null;
    };
};


export {useHandleSuccessResponse, useHandleErrorResponse};
