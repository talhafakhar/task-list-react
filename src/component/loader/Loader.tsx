import {Spinner} from "flowbite-react";

export const Loader = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="text-center">
                <Spinner aria-label="Center-aligned spinner example" size="lg"/>
            </div>
        </div>
    );
};
