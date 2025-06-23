export type NavLink = {
    name: string;
    path: string;
    onClick?: () => void;
    showIfLoggedIn?: boolean;
    showIfLoggedOut?: boolean;
    showIfAdmin?: boolean;
};

const getCurrentMonth = () => {
    const date = new Date();
    return date.toLocaleString('default', { month: 'long' }).toLowerCase(); // e.g., "march"
};

const getCurrentYear = () => {
    const date = new Date();
    return date.getFullYear().toString(); // e.g., "2025"
};

export const Links: NavLink[] = [
    {
        name: "Home",
        path: "/"
    },
    {
        name: "Schedule",
        path: "/schedule"
    },
    {
        name: "Activity List",
        path: "/activity_list"
    },
    {
        name: "Performance",
        path: "/performance"
    },
    {
        name: "Monthly Review",
        path: `/monthly_review/${getCurrentMonth()}`,
        showIfLoggedIn: true
    },
    {
        name: "Life Overview",
        path: `/life_overview/${getCurrentYear()}`,
        showIfLoggedIn: true
    },
    {
        name: "Register/Login",
        path: "/access",
        showIfLoggedOut: true
    },
    {
        name: "Admin",
        path: "/admin",
        showIfLoggedIn: true,
        showIfAdmin: true
    },
    {
        name: "Logout",
        path: "#",
        showIfLoggedIn: true
    }
];