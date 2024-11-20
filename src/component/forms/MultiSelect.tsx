import React, {useState} from "react";
import axios from "axios";
import Select, {ActionMeta, MultiValue} from "react-select";
import {ClipLoader} from "react-spinners";
import {useHandleErrorResponse} from "../../hook/HandleApiResponse";

interface Option {
    label: string;
    value: string;
}
interface MultiSelectProps {
    apiRoute: string;
    onSubmit: (selectedItems: string[], permission: string) => void;
    sharedLoading?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({apiRoute, onSubmit, sharedLoading}) => {
    const [options, setOptions] = useState<Option[]>([]);
    const [selectedItems, setSelectedItems] = useState<Option[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [isValidInput, setIsValidInput] = useState<boolean | null>(null);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const handleErrorResponse = useHandleErrorResponse();
    const [permission, setPermission] = useState<string>("view");
    const handleSearch = (inputValue: string) => {
        setInputValue(inputValue);
        if (!inputValue) return;

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        const timeout = setTimeout(() => {
            axios
                .get(apiRoute.replace(":username", inputValue))
                .then((response) => {
                    if (response.data && response.data.id) {
                        if (!options.some((option) => option.value !== response.data.id)) {
                            setIsValidInput(true);
                            setOptions((prevOptions) => [
                                ...prevOptions,
                                {
                                    label: inputValue,
                                    value: response.data.id,
                                },
                            ]);
                        }
                    } else {
                        setIsValidInput(false);
                    }
                })
                .catch((error) => {
                    handleErrorResponse(error);
                    setIsValidInput(false);
                });
        }, 500);
        setTypingTimeout(timeout);
    };
    const handleChange = (newValue: MultiValue<Option>, actionMeta: ActionMeta<Option>) => {
        setSelectedItems([...newValue]);
    };
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && isValidInput) {
            const selectedUser = options.find(
                (option) => option.label === inputValue && !selectedItems.some((item) => item.value === option.value)
            );
            if (selectedUser) {
                setSelectedItems((prev) => [
                    ...prev,
                    {label: selectedUser.label, value: selectedUser.value},
                ]);
                setInputValue("");
                setIsValidInput(null);
            }
        }
    };
    const handleSubmit = () => {
        const selectedValues = selectedItems.map((item) => item.value);
        onSubmit(selectedValues, permission);
    };
    return (
        <div>
            <Select
                isMulti
                options={options}
                value={selectedItems}
                onInputChange={handleSearch}
                inputValue={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Add By Usernames"
                noOptionsMessage={() => "No results"}
                menuIsOpen={false}
                styles={{
                    control: (provided: any) => ({
                        ...provided,
                        borderColor: isValidInput === false ? "red" : isValidInput === true ? "green" : provided.borderColor,

                        "&:hover": {
                            borderColor: isValidInput === false ? "red" : isValidInput === true ? "green" : provided.borderColor,
                            boxShadow: "none",
                        },
                        "&:focus": {
                            borderColor: "transparent",
                            boxShadow: "none",
                        },
                        outline: "none",
                    }),

                }}
            />
            <div className="flex justify-end mt-4 space-x-4">
                    <select
                        value={permission}
                        onChange={(e) => setPermission(e.target.value)}
                        className="text-sm md:text-base bg-white text-gray-700 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="view">View</option>
                        <option value="edit">Edit</option>
                    </select>
                <button
                    className="p-2.5 px-3.5 text-sm font-medium text-white bg-caribbean-green rounded hover:bg-caribbean-green-dark ml-2"
                    onClick={handleSubmit}
                    disabled={selectedItems.length === 0}
                >
                    {sharedLoading ? (
                        <ClipLoader color="#fff" size={20}/>
                    ) : (
                        "Share"
                    )}
                </button>
            </div>
        </div>
    );
};

export default MultiSelect;
