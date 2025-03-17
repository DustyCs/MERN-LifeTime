export type NavLink = {
    name: string;
    path: string;
    onClick?: () => void;
    showIfLoggedIn?: boolean;
    showIfLoggedOut?: boolean;
};

const getCurrentMonth = () => {
    const date = new Date();
    return date.toLocaleString('default', { month: 'long' }).toLowerCase(); // e.g., "march"
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
        path: "/life_overview"
    },
    {
        name: "Register/Login",
        path: "/access",
        showIfLoggedOut: true
    },
    {
        name: "Logout",
        path: "#",
        showIfLoggedIn: true
    }
];