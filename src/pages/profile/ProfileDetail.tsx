"use client";
import React, {useEffect, useState} from "react";
import {Card} from 'flowbite-react';
import {useNavigate} from "react-router-dom";
import {reactRoutes} from "../../routes";

const ProfileDetail = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({
        name: "N/A",
        email: "N/A",
        username: "N/A",
        created_at: "N/A",

    });
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData) {
            setUserDetails({
                name: userData.user.name || "N/A",
                email: userData.user.email || "N/A",
                username: userData.user.username || "N/A",
                created_at: userData.user.created_at || "N/A",
            });
        }
    }, []);

    return (
        <div className="mx-auto max-w-xl">
            <Card className="mt-[10rem] rounded-lg border border-stroke shadow-lg">
                <div className="text-center">
                    <div
                        className="relative mx-auto -mt-20 h-[150px] w-[160px] rounded-full bg-white/20 p-1 backdrop-blur-lg sm:h-[100] sm:w-[100] sm:p-2">
                        <div className="relative drop-shadow-lg">
                            <img
                                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                width={160}
                                height={150}
                                className="h-[150px] w-[160px] rounded-full object-cover"
                                alt="Profile"
                            />
                        </div>
                    </div>
                    {/* User Details */}
                    <div className="mb-5 mt-6">
                        <h3 className="text-3xl font-bold text-primary ">
                            {userDetails.name || "N/A"}
                        </h3>
                    </div>
                    {/* User Info */}
                    <div className="border-gray-300 mt-4 border-t p-4">
                        <div className="text-gray-700 mb-5 flex justify-between text-base font-medium">
                            <span className="font-semibold text-primary">Username</span>
                            <span>{userDetails.username || "N/A"}</span>
                        </div>
                        <div className="text-gray-700 mb-5 flex justify-between text-base font-medium">
                            <span className="font-semibold text-primary">Email</span>
                            <span>{userDetails.email || "N/A"}</span>
                        </div>
                        <div className="text-gray-700 flex justify-between text-base font-medium">
                            <span className="font-semibold text-primary">Created At</span>
                            <span>{userDetails.created_at || "N/A"}</span>
                        </div>
                    </div>
                    {/*Add back button */}
                    <div className="mt-5">
                        <button
                            onClick={() => navigate(reactRoutes.TASK_LIST)}
                            className="bg-caribbean-green hover:bg-caribbean-green-dark text-white px-4 py-2 rounded-lg"
                        >
                            Back To Task List
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProfileDetail;
