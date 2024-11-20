import React from "react";
import {TextInput, Tooltip} from "flowbite-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useFormik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import {useHandleErrorResponse, useHandleSuccessResponse} from "../../hook/HandleApiResponse";
import {ClipLoader} from "react-spinners";

interface AddInputProps {
    url: string;
    onSuccess: () => void;
    type: string;
    placeholder: string;
}
export const AddInput: React.FC<AddInputProps> = ({url, onSuccess, type, placeholder}) => {
    const handleSuccessResponse = useHandleSuccessResponse();
    const handleErrorResponse = useHandleErrorResponse();
    const [loading, setLoading] = React.useState(false);
    const formik = useFormik({
        initialValues: {
            input: "",
        },
        validationSchema: Yup.object({
            input: Yup.string().required("Required"),
        }),
        onSubmit: async (values) => {
            let body;
            if (type === "Task List") {
                body = {
                    title: values.input
                }
            } else {
                body = {
                    description: values.input
                }
            }
            setLoading(true);
            await axios.post(url, body)
                .then((res) => {
                    handleSuccessResponse(res);
                    formik.resetForm();
                    onSuccess();
                }).catch((error) => {
                    handleErrorResponse(error);
                }).finally(() => {
                    setLoading(false);
                })
        }
    })
    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="flex items-center">
                <TextInput
                    type="text"
                    placeholder={placeholder}
                    className="md:w-[200px] lg:w-[300px] xl:w-[400px] flex-grow"
                    {...formik.getFieldProps("input")}
                />
                <Tooltip content={`Add ${type}`}>
                    <button
                        className="p-2.5 px-3.5 text-sm font-medium text-white bg-caribbean-green rounded hover:bg-caribbean-green-dark ml-2"
                        type="submit"
                    >
                        {loading ? (
                            <ClipLoader color="#fff" size={20}/>
                        ) : (
                            <FontAwesomeIcon icon={faPlus}/>
                        )}
                    </button>
                </Tooltip>
            </div>
            {formik.touched.input && formik.errors.input ? (
                <div className="text-red-500 mt-1">{formik.errors.input}</div>
            ) : null}
        </form>
    );
};
