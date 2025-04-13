const API_URL = 'https://yourapiurl.com';

export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        return true;
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};

export const isAuthenticated = async () => {
    try {
        const response = await fetch(`${API_URL}/isAuthenticated`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to check authentication status');
        }

        const data = await response.json();
        return data.isAuthenticated;
    } catch (error) {
        console.error('Error checking authentication status:', error);
        throw error;
    }
};
export const refresh = async (refreshToken) => {
    try {
        const response = await fetch(`${API_URL}/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during token refresh:', error);
        throw error;
    }
};