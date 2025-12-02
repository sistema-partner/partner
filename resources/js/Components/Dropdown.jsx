import { Link } from "@inertiajs/react";
import { createContext, useContext, useState, useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);
    const overlayRef = useRef(null);

    const toggleOpen = (event) => {
        setOpen((prev) => !prev);
        if (overlayRef.current) {
            overlayRef.current.toggle(event);
        }
    };

    return (
        <DropDownContext.Provider
            value={{ open, setOpen, toggleOpen, overlayRef }}
        >
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { toggleOpen } = useContext(DropDownContext);

    return (
        <div onClick={(e) => toggleOpen(e)} className="cursor-pointer">
            {children}
        </div>
    );
};

const Content = ({
    align = "right",
    width = "48",
    contentClasses = "py-1 bg-white",
    children,
}) => {
    const { overlayRef } = useContext(DropDownContext);

    let alignmentClasses = "origin-top";

    if (align === "left") {
        alignmentClasses = "ltr:origin-top-left rtl:origin-top-right start-0";
    } else if (align === "right") {
        alignmentClasses = "ltr:origin-top-right rtl:origin-top-left end-0";
    }

    let widthClasses = "";

    if (width === "48") {
        widthClasses = "w-48";
    }

    return (
        <OverlayPanel
            ref={overlayRef}
            className={`z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
        >
            <div
                className={`rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none ${contentClasses}`}
            >
                {children}
            </div>
        </OverlayPanel>
    );
};

const DropdownLink = ({ className = "", children, ...props }) => {
    return (
        <Link
            {...props}
            className={
                "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none " +
                className
            }
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
