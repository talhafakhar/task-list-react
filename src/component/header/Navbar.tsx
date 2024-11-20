import React, {useEffect, useState} from 'react';
import {Avatar, Dropdown, Navbar} from "flowbite-react";
import {reactRoutes} from "../../routes";
import {useNavigate} from "react-router-dom";

export const Nav: React.FC = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') as string);
        if (userData) {
            setEmail(userData.user.email);
        }
    }, []);
    const handleSignOut = () => {
        localStorage.removeItem('user');
        window.location.replace(reactRoutes.LOGIN);
    };
    return (
        <Navbar className='bg-transparent-black dark:bg-transparent-white text-white dark:text-black'>
            <Navbar.Brand href="https://flowbite-react.com">
                <img src="/assets/svg/logo.svg" alt="Flowbite" className="h-8"/>
                <span
                    className="self-center  whitespace-nowrap text-xl font-semibold dark:text-white ms-1 font-cursive">Listify</span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                rounded/>
                    }
                >
                    <Dropdown.Item>{email}</Dropdown.Item>
                    <Dropdown.Item onClick={() => {
                        navigate(reactRoutes.USER_PROFILE)
                    }}>Profile</Dropdown.Item>
                    <Dropdown.Divider/>
                    <Dropdown.Item className='text-red-500' onClick={handleSignOut}>Sign out</Dropdown.Item>
                </Dropdown>
            </div>
        </Navbar>
    );
}
