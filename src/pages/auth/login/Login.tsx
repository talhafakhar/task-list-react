import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {reactRoutes} from "../../../routes";
import {SignUpForm} from "../../../component/forms/RegisterForm";
import {SignInForm} from "../../../component/forms/LoginForm";
import {ForgotForm} from "../../../component/forms/ForgotForm";

const Login: React.FC = () => {
    const [formType, setFormType] = useState<'login' | 'register' | 'forgotPassword'>('login');
    const handleFormSwitch = (type: 'login' | 'register' | 'forgotPassword') => {
        setFormType(type);
    };
    return (
        <section>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link to={reactRoutes.TASK_LIST}
                      className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src="/assets/svg/logo.svg" alt="logo"/>
                    <span className="text-white dark:text-black">Listify</span>
                </Link>
                <div
                    className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            {formType === 'login' ? 'Sign in to your account' : formType === 'register' ? 'Create your account' : 'Forgot your password?'}
                        </h1>
                        <div className="space-y-4 md:space-y-6">
                            {formType === 'login' && (
                                <>
                                    <SignInForm handleFormSwitch={handleFormSwitch}/>
                                </>
                            )}
                            {formType === 'register' && (
                                <>
                                    <SignUpForm handleFormSwitch={handleFormSwitch}/>
                                </>
                            )}
                            {formType === 'forgotPassword' && (
                                <>
                                    <ForgotForm handleFormSwitch={handleFormSwitch}/>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
