import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { createContext, useContext, useState, useRef, useEffect } from 'react';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const contentRef = useRef(null);
    const previousFocus = useRef(null);

    const toggleOpen = () => {
        setOpen(prev => {
            const next = !prev;
            if (next) {
                previousFocus.current = document.activeElement;
            }
            return next;
        });
    };

    // Click outside & ESC
    useEffect(() => {
        if (!open) return;

        const handlePointer = (e) => {
            if (!containerRef.current) return;
            if (containerRef.current.contains(e.target)) return; // inside
            setOpen(false);
        };
        const handleKey = (e) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handlePointer, true);
        document.addEventListener('touchstart', handlePointer, true);
        document.addEventListener('keydown', handleKey, true);
        return () => {
            document.removeEventListener('mousedown', handlePointer, true);
            document.removeEventListener('touchstart', handlePointer, true);
            document.removeEventListener('keydown', handleKey, true);
        };
    }, [open]);

    // Focus management when opening
    useEffect(() => {
        if (open && contentRef.current) {
            // focus first focusable element or content container
            const focusable = contentRef.current.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            (focusable || contentRef.current).focus();
        } else if (!open && previousFocus.current) {
            try { previousFocus.current.focus(); } catch {}
        }
    }, [open]);

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen, triggerRef, contentRef }}>
            <div ref={containerRef} className="relative">
                {children}
            </div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen, triggerRef } = useContext(DropDownContext);

    return (
        <>
            <div ref={triggerRef} onClick={toggleOpen}>{children}</div>
            {open && (
                <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
};

const Content = ({
    align = 'right',
    width = '48',
    contentClasses = 'py-1 bg-white',
    children,
}) => {
    const { open, setOpen, contentRef } = useContext(DropDownContext);

    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }

    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'w-48';
    }

    return (
        <>
            <Transition
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                    ref={contentRef}
                    role="menu"
                    tabIndex={-1}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className={`rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none ${contentClasses}`}
                    >
                        {children}
                    </div>
                </div>
            </Transition>
        </>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={
                'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ' +
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
