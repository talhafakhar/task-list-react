import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import TaskList from "./pages/taskList/TaskList";
import {reactRoutes} from "./routes";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import {setupAxios} from "./component/AuthHelper";
import Login from "./pages/auth/login/Login";
import ProfileDetail from "./pages/profile/ProfileDetail";

setupAxios(axios)
function App() {
    const currentLoggedIn = localStorage.getItem("user");
    return (
        <Router>
            <Routes>
                <Route>
                    {currentLoggedIn ? (
                        <>
                            <Route path={reactRoutes.TASK_LIST} element={<TaskList/>}/>
                            <Route path={reactRoutes.USER_PROFILE} element={<ProfileDetail/>}/>
                        </>
                    ) : (
                        <>
                            <Route path='/*' element={<Login/>}/>
                        </>
                    )}
                </Route>
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                pauseOnHover
            />
        </Router>
    );
}

export default App;
