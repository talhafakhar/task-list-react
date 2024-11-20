import React, {useState} from "react";
import axios from "axios";
import Select, {ActionMeta, MultiValue} from "react-select";

interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    apiRoute: string;
    onSubmit: (selectedItems: string[], permission: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({apiRoute, onSubmit}) => {
    const [options, setOptions] = useState<Option[]>([]);
    const [selectedItems, setSelectedItems] = useState<Option[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [isValidInput, setIsValidInput] = useState<boolean | null>(null);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [permission, setPermission] = useState<string>("view"); // Permission state
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
                            setIsValidInput(true); // Valid user found
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
                    console.error("Error fetching search results:", error);
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
                placeholder="Search and select a username..."
                noOptionsMessage={() => "No results"}
                menuIsOpen={false}
                styles={{
                    control: (provided) => ({
                        ...provided,
                        borderColor: isValidInput === false ? "red" : isValidInput === true ? "green" : provided.borderColor,

                        "&:hover": {
                            borderColor: isValidInput === false ? "red" : isValidInput === true ? "green" : provided.borderColor,
                            boxShadow: "none",
                        },
                    }),
                }}
            />
            <div className="flex justify-end mt-4 space-x-4">
                <div className="w-48">
                    <select
                        value={permission}
                        onChange={(e) => setPermission(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="view">View</option>
                        <option value="edit">Edit</option>
                    </select>
                </div>
                <button
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={selectedItems.length === 0}
                >
                    Share
                </button>
            </div>
        </div>
    );
};

export default MultiSelect;
