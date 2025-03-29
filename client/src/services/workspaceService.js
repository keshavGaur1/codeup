import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/workspace`;

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const workspaceService = {
  // Get all workspaces (both owned and invited)
  getWorkspaces: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      throw error.response?.data || { message: "Failed to fetch workspaces" };
    }
  },

  // Get a specific workspace by ID
  getWorkspace: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching workspace:", error);
      throw error.response?.data || { message: "Failed to fetch workspace" };
    }
  },

  // Get workspaces where user is owner
  getUserWorkspaces: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}/workspaces`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user workspaces:", error);
      throw error.response?.data || { message: "Failed to fetch user workspaces" };
    }
  },

  // Create new workspace
  createWorkspace: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/create`, {
        name: data.name,
        isPublic: data.isPublic
      });
      return response.data;
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw error.response?.data || { message: "Failed to create workspace" };
    }
  },

  // Invite user to workspace
  inviteUser: async ({ workspaceId, email }) => {
    try {
      const response = await axios.post(`${API_URL}/invite`, {
        workspaceId,
        email
      });
      return response.data;
    } catch (error) {
      console.error("Error inviting user:", error);
      throw error.response?.data || { message: "Failed to invite user" };
    }
  },

  // Delete workspace
  deleteWorkspace: async (workspaceId) => {
    try {
      const response = await axios.delete(`${API_URL}/${workspaceId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting workspace:", error);
      throw error.response?.data || { message: "Failed to delete workspace" };
    }
  },

  // Update workspace
  updateWorkspace: async (workspaceId, data) => {
    try {
      const response = await axios.put(`${API_URL}/${workspaceId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating workspace:", error);
      throw error.response?.data || { message: "Failed to update workspace" };
    }
  },

  // Remove member from workspace
  removeMember: async (workspaceId, userId) => {
    try {
      const response = await axios.delete(`${API_URL}/${workspaceId}/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing member:", error);
      throw error.response?.data || { message: "Failed to remove member" };
    }
  }
};