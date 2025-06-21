import API from "../../api/api";

export const getOverview = async () => {
    try {
        const response = await API.get('/admin/overview');
        return response.data;
    } catch (error) {
        console.error('Error fetching overview data:', error);
    }
}

// Users

// export const getUsers = async () => {
//     try {
//         const response = await API.get('/admin/users');
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching users:', error);
//     }
// }

export const getUsers = async (query: string, page: number) => {
    try {
        const response = await API.get('/admin/users', { params: { query, page } });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

export const getUser = async (userId: string) => {
    try {
        const response = await API.get(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

export const deleteUser = async (userId: string) => {
    try {
        const response = await API.delete(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

export const setActiveUser = async (userId: string) => {
    try {
        const response = await API.patch(`/admin/users/${userId}/toggle-active`);
        return response.data;
    } catch (error) {
        console.error('Error activating user:', error);
    }
}

export const setUserAdmin = async (userId: string) => {
    try {
        const response = await API.patch(`/admin/users/${userId}/toggle-admin`);
        return response.data;
    } catch (error) {
        console.error('Error setting user admin status:', error);
    }
}

// Schedules

export const getSchedules = async () => {
    try {
        const response = await API.get('/admin/schedules');
        return response.data;
    } catch (error) {
        console.error('Error fetching schedules:', error);
    }
}

export const deleteSchedule = async (scheduleId: string) => {
    try {
        const response = await API.delete(`/admin/schedules//event/${scheduleId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting schedule:', error);
    }
}

// Activities

export const getActivities = async (filters: any) => {
    try {
        const response = await API.get('/admin/activities', { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
}

export const toggleActivityStatus = async (activityId: string) => {
    try {
        const response = await API.patch(`/admin/activities/${activityId}/toggle-complete`);
        return response.data;
    } catch (error) {
        console.error('Error toggling activity status:', error);
    }
}

export const deleteActivity = async (activityId: string) => {
    try {
        const response = await API.delete(`/admin/activities/${activityId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting activity:', error);
    }
}

// Analytics

export const adminQueries = async () => {
    try {
        const response = await API.get('/admin/queries');
        return response.data;
    } catch (error) {
        console.error('Error fetching queries:', error);
    }
}

