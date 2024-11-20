import React from 'react';
import {Button, Label, TextInput} from "flowbite-react";
import * as Yup from "yup";
import {useFormik} from "formik";
import axios from "axios";
import {apiRoutes, reactRoutes} from "../../routes";
import {toast} from "react-toastify";
import {useHandleErrorResponse, useHandleSuccessResponse} from "../../hook/HandleApiResponse";

interface SignInFormProps {
    handleFormSwitch: (type: 'login' | 'register' | 'forgotPassword') => void;
}

interface Credentials {
    login: string;
    password: string;
}

export const SignInForm: React.FC<SignInFormProps> = ({handleFormSwitch}) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const handleSuccessResponse = useHandleSuccessResponse();
    const handleErrorResponse = useHandleErrorResponse();
    const loginSchema = Yup.object().shape({
        login: Yup.string()
            .required('Login is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .max(20, 'Password must be at most 20 characters')
            .required('Password is required')
    });
    const formik = useFormik<Credentials>({
        initialValues: {
            login: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit: async (values: Credentials) => {
            setLoading(true);
            try {
                await axios.post(apiRoutes.LOGIN, {
                    login: values.login,
                    password: values.password,
                })
                    .then((res: any) => {
                        const {token} = res.data;
                        if (token) {
                            localStorage.setItem("user", JSON.stringify(res.data));
                            handleSuccessResponse(res);
                            window.location.replace(reactRoutes.TASK_LIST);
                        } else {
                            toast.error("Token not found");
                        }
                    })
                    .catch((error: any) => {
                        handleErrorResponse(error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } catch (error: any) {
                handleErrorResponse(error);
            }
        },
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <Label htmlFor="text" value="Your Email/Username"/>
                    <TextInput
                        {...formik.getFieldProps('login')}
                        type="text" placeholder="Enter Your Email/Username" required className="mt-2"/>
                    {
                        formik.touched.login && formik.errors.login ? (
                            <div className="text-red-500 text-xs">{formik.errors.login}</div>
                        ) : null
                    }
                </div>
                <div>
                    <Label htmlFor="password" value="Password"/>
                    <TextInput
                        {...formik.getFieldProps('password')}
                        id="password" type="password" placeholder="Enter Your Password" required
                        className="mt-2"/>
                    {
                        formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-xs">{formik.errors.password}</div>
                        ) : null
                    }
                </div>
                <div className="text-right">
                     <span onClick={() => handleFormSwitch('forgotPassword')}
                           className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer">
            Forgot password?
          </span>
                </div>
                <Button
                    disabled={loading}
                    type="submit"
                    className="mt-3 bg-caribbean-green text-white w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {loading ? "Please Wait..." : "Sign In"}
                </Button>
            </form>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <span
                    onClick={() => handleFormSwitch('register')}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer"
                >
                        Sign up
                </span>
            </p>
        </div>
    );
}
