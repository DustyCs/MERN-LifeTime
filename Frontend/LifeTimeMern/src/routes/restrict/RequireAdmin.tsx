import { Navigate, Outlet } from "react-router-dom";
import { useAdminContext } from "../../Context/AdminContext";
import toast from "react-hot-toast";
import { useState } from "react";

export default function RequireAdmin() {
    const { isAdmin } = useAdminContext();
    const [shownToast, setShownToast] = useState(false);

    if (isAdmin === null || isAdmin === undefined) {
        return <div>Loading...</div>; // or a spinner
    }

    if (!isAdmin) {
        if (!shownToast) {
          toast.error("You must be an admin to access this page.");
          setShownToast(true);
        }
        return <Navigate to="/" />;
    }

  return <Outlet />
 
}
