import { Navigate, Outlet } from "react-router-dom";
import { useAdminContext } from "../../Context/AdminContext";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function RequireAdmin() {
    const { isAdmin, isLoading } = useAdminContext();
    const [shownToast, setShownToast] = useState(false);

  
    useEffect(() => {
      if (!isLoading && !isAdmin && !shownToast) {
        toast.error("You must be an admin to access this page.");
        setShownToast(true);
      }
    }, [isLoading, isAdmin, shownToast]);

    if (isLoading) {
      return <div>Loading...</div>; // Or a spinner
    }

    if (!isAdmin) {
      return <Navigate to="/" />;
    }

    return <Outlet />;
  }