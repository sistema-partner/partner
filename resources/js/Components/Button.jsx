import React from "react";
import { Link } from "@inertiajs/react";

export default function Button({
    href,
    as = "link", // 'link' | 'button'
    variant = "primary", // 'primary' | 'secondary'
    className = "",
    children,
    ...props
}) {
    const base =
        "inline-flex items-center px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-offset-2 transition-colors duration-150";

    const variants = {
        primary:
            "bg-blue-primary border border-blue-primary text-white hover:bg-white hover:text-blue-primary dark:bg-blue-primary dark:border-blue-primary dark:text-white dark:hover:bg-white dark:hover:text-blue-light",
        secondary:
            "bg-white border border-blue-primary text-blue-primary shadow-sm hover:bg-blue-primary hover:text-white dark:bg-dark-card dark:border-blue-primary dark:text-white dark:hover:bg-blue-primary",
    };

    const classes = `${base} ${
        variants[variant] || variants.primary
    } ${className}`.trim();

    if (as === "button" || !href) {
        return (
            <button type="button" className={classes} {...props}>
                {children}
            </button>
        );
    }

    return (
        <Link href={href} className={classes} {...props}>
            {children}
        </Link>
    );
}
