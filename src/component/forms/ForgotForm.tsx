import React, {useState} from 'react';
import {Button, Label, TextInput} from "flowbite-react";
import * as Yup from "yup";
import {useFormik} from "formik";
import axios from "axios";
import {apiRoutes, reactRoutes} from "../../routes";
import {useHandleErrorResponse, useHandleSuccessResponse} from "../../hook/HandleApiResponse";
import {useNavigate} from "react-router-dom";


interface ForgotFormProps {
    handleFormSwitch: (type: 'login' | 'register' | 'forgotPassword') => void;
}

interface ForgotFormValue {
    email: string;
}

export const ForgotForm: React.FC<ForgotFormProps> = ({handleFormSwitch}) => {
    const [loading, setLoading] = useState(false);
    const handleError = useHandleErrorResponse();
    const handleSuccessResponse = useHandleSuccessResponse();
    const navigate = useNavigate();
    const ForgotPasswordPageSchema = Yup.object().shape({
        email: Yup.string().required("Email is required").email("Invalid email"),
    });
    const formik = useFormik<ForgotFormValue>({
        initialValues: {
            email: "",
        },
        validationSchema: ForgotPasswordPageSchema,
        onSubmit: async (values: ForgotFormValue) => {
            setLoading(true);
            try {
                await axios.post(apiRoutes.FORGOT_PASSWORD, {
                    email: values.email,
                })
                    .then((res: any) => {
                        handleSuccessResponse(res);
                        navigate(reactRoutes.LOGIN);
                    })
                    .catch((error) => {
                        handleError(error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } catch (error: any) {
                handleError(error);
            }
        },
    });
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <Label htmlFor="email" value="Your email"/>
                    <TextInput {...formik.getFieldProps('email')}
                               id="email" type="email" placeholder="Enter Your Email" required className="mt-2"/>
                    {
                        formik.touched.email && formik.errors.email ?
                            <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p> : null
                    }
                </div>
                <Button disabled={loading} type="submit"
                        className="bg-caribbean-green text-white w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mt-3">
                    {loading ? 'Please Wait...' : 'Reset Password'}
                </Button>
            </form>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Remember your password?{" "}
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
