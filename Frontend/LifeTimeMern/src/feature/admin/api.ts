import API from "../../api/api";

export const getOverview = async () => {
    try {
        const response = await API.get('/admin/overview');
        return response.data;
    } catch (error) {
        console.error('Error fetching overview data:', error);
    }
}

export const getUsers = async () => {
    try {
        const response = await API.get('/admin/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

export const getSchedules = async () => {
    try {
        const response = await API.get('/admin/schedules');
        return response.data;
    } catch (error) {
        console.error('Error fetching schedules:', error);
    }
}

export const getActivities = async (filters: any) => {
    try {
        const response = await API.get('/admin/activities', { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
}

export const adminQueries = async () => {
    try {
        const response = await API.get('/admin/queries');
        return response.data;
    } catch (error) {
        console.error('Error fetching queries:', error);
    }
}