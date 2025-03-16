export type NavLink = {
    name: string;
    path: string;
    onClick?: () => void;
};

export const Links = [
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
        path: "/monthly_review"
    },
    {
        name: "Life Overview",
        path: "/life_overview"
    },
    {
        name: "Register/Login",
        path: "/access",
        showIfLoggedOut: true // ✅ Only show if user is NOT logged in
    },
    {
        name: "Logout",
        path: "#",
        showIfLoggedIn: true // ✅ Only show if user IS logged in
    }
]
