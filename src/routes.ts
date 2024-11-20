let api = process.env.REACT_APP_API_URL;
export const reactRoutes = {
    TASK_LIST: `/`,
    USER_PROFILE: `/profile`,
    LOGIN: `/login`,
}
export const apiRoutes = {
    //TASK_LIST
    TASK_LIST: api + `task-lists`,
    CREATE_TASK_LIST: api + `task-lists`,
    DELETE_TASK_LIST: (id: string) => api + `task-lists/${id}`,
    UPDATE_TASK_LIST: (id: string) => api + `task-lists/${id}`,
    //TODO
    TODO_LIST: (id: string) => api + `task-lists/${id}/tasks`,
    CREATE_TODO: (id: string) => api + `task-lists/${id}/tasks`,
    UPDATE_TODO: (taskListId: string, todoId: string) => `${api}task-lists/${taskListId}/tasks/${todoId}`,
    DELETE_TODO: (taskListId: string, todoId: string) => `${api}task-lists/${taskListId}/tasks/${todoId}`,
    //SHARE_TASK_LIST
    CHECK_USERNAME: (id: string) => api + `task-lists/check-username/${id}`,
    SHARE_TASK_LIST: (id: string) => api + `task-lists/${id}/share`,
    UNSHARE_TASK_LIST: (id: string) => api + `task-lists/${id}/un-share`,
    UPDATE_PERMISSION: (id: string) => api + `task-lists/${id}/update-permission`,
    SHARED_WITH: (id: string) => api + `task-lists/${id}/shared-with`,
    //AUTH
    USER_PROFILE: api + `profile`,
    LOGIN: api + `login`,
    REGISTER: api + `register`,
    FORGOT_PASSWORD: api + `forgot-password`,
    LOGOUT: api + `logout`,
}