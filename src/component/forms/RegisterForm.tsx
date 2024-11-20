import React from 'react';
import {Button, Label, TextInput} from "flowbite-react";
import * as Yup from "yup";
import {useFormik} from "formik";
import axios from "axios";
import {apiRoutes, reactRoutes} from "../../routes";
import {useHandleErrorResponse, useHandleSuccessResponse} from "../../hook/HandleApiResponse";

interface SignUpFormProps {
    handleFormSwitch: (type: 'login' | 'register' | 'forgotPassword') => void;
}

interface SignUpFormValues {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({handleFormSwitch}) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const handleSuccessResponse = useHandleSuccessResponse();
    const handleErrorResponse = useHandleErrorResponse();
    const SignupPageSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        username: Yup.string().required('Username is required'),
        email: Yup.string().required('email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .max(20, 'Password must be at most 20 characters')
            .required('Password is required'),
        password_confirmation: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .max(20, 'Password must be at most 20 characters')
            .required('Password is required')
            .oneOf([Yup.ref('password')], 'Passwords must match'),
    });
    const formik = useFormik<SignUpFormValues>({
        initialValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            password_confirmation: "",
        },
        validationSchema: SignupPageSchema,
        onSubmit: async (values: SignUpFormValues) => {
            setLoading(true);
            await axios
                .post(apiRoutes.REGISTER, {
                    name: values.name,
                    username: values.username,
                    email: values.email,
                    password: values.password,
                    password_confirmation: values.password_confirmation,
                })
                .then((res) => {
                    localStorage.setItem("user", JSON.stringify(res.data));
                    handleSuccessResponse(res);
                    window.location.replace(reactRoutes.TASK_LIST);
                })
                .catch((error) => {
                    handleErrorResponse(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        },
    });
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <Label htmlFor="name" value="Your Name"/>
                    <TextInput
                        {...formik.getFieldProps('name')}
                        type="text" placeholder="Enter Your Name" required className="mt-2"/>
                    {
                        formik.errors.name && formik.touched.name
                            ? <div className="text-red-500 text-xs">{formik.errors.name}</div>
                            : null
                    }
                </div>
                <div>
                    <Label htmlFor="username" value="Username"/>
                    <TextInput
                        {...formik.getFieldProps('username')}
                        type="text" placeholder="Enter Your Username" required className="mt-2"/>
                    {
                        formik.errors.email && formik.touched.email
                            ? <div className="text-red-500 text-xs">{formik.errors.username}</div>
                            : null
                    }
                </div>
                <div>
                    <Label htmlFor="email" value="Your email"/>
                    <TextInput
                        {...formik.getFieldProps('email')}
                        type="email" placeholder="Enter Your Email" required className="mt-2"/>
                    {
                        formik.errors.email && formik.touched.email
                            ? <div className="text-red-500 text-xs">{formik.errors.email}</div>
                            : null
                    }
                </div>
                <div>
                    <Label htmlFor="password" value="Password"/>
                    <TextInput
                        {...formik.getFieldProps('password')}
                        type="password" placeholder="Enter Your Password" required
                        className="mt-2"/>
                    {
                        formik.errors.password && formik.touched.password
                            ? <div className="text-red-500 text-xs">{formik.errors.password}</div>
                            : null
                    }
                </div>
                <div>
                    <Label htmlFor="confirmPassword" value="Confirm Password"/>
                    <TextInput
                        {...formik.getFieldProps('password_confirmation')}
                        type="password" placeholder="Confirm Your Password" required
                        className="mt-2"/>
                    {
                        formik.errors.password_confirmation && formik.touched.password_confirmation
                            ? <div className="text-red-500 text-xs">{formik.errors.password_confirmation}</div>
                            : null
                    }
                </div>
                <Button disabled={loading} type="submit"
                        className="mt-3 bg-caribbean-green text-white w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                    {loading
                        ? 'Please Wait'
                        : 'Sign Up'
                    }
                </Button>
            </form>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <span
                    onClick={() => handleFormSwitch('login')}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer"
                >
                        Sign in
                    </span>
            </p>
        </div>
    );
}
