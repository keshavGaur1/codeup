import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { workspaceService } from "../services/workspaceService";
import WorkspaceCard from "../components/WorkspaceCard";

const Workspaces = () => {
  const { user } = useContext(AuthContext);
  const [ownedWorkspaces, setOwnedWorkspaces] = useState([]);
  const [invitedWorkspaces, setInvitedWorkspaces] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [workspaceForm, setWorkspaceForm] = useState({ name: "", isPublic: false });
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    fetchWorkspaces();
  }, [user.id]);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const allWorkspaces = await workspaceService.getWorkspaces();
      setOwnedWorkspaces(
        allWorkspaces.filter((w) =>
          w.members.some((m) => m.userId._id === user.id && m.role === "owner")
        )
      );
      setInvitedWorkspaces(
        allWorkspaces.filter((w) =>
          w.members.some((m) => m.userId._id === user.id && m.role !== "owner")
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    try {
      const newWorkspace = await workspaceService.createWorkspace(workspaceForm);
      setOwnedWorkspaces([...ownedWorkspaces, newWorkspace]);
      setShowCreateModal(false);
      setWorkspaceForm({ name: "", isPublic: false });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateWorkspace = async (e) => {
    e.preventDefault();
    try {
      const updated = await workspaceService.updateWorkspace(activeWorkspace._id, workspaceForm);
      setOwnedWorkspaces(ownedWorkspaces.map((w) => (w._id === updated._id ? updated : w)));
      setShowUpdateModal(false);
      setActiveWorkspace(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteWorkspace = async (workspaceId) => {
    if (!window.confirm("Are you sure you want to delete this workspace?")) return;
    try {
      await workspaceService.deleteWorkspace(workspaceId);
      setOwnedWorkspaces((prev) => prev.filter((w) => w._id !== workspaceId));
    } catch (error) {
      setError(error.message || "Failed to delete workspace");
      console.error("Delete workspace error:", error);
    }
  };

  const handleInviteUser = async () => {
    try {
      await workspaceService.inviteUser({
        workspaceId: activeWorkspace._id,
        email: inviteEmail,
      });
      setShowInviteModal(false);
      setActiveWorkspace(null);
      setInviteEmail("");
      fetchWorkspaces();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRemoveMember = async (workspaceId, userId) => {
    try {
      await workspaceService.removeMember(workspaceId, userId);
      fetchWorkspaces();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-senary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal mr-3"></div>
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-background min-h-screen text-octonary">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-teal">My Workspaces</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-teal text-background px-5 py-2 rounded-lg hover:bg-hover-teal transition-colors duration-200 font-semibold"
        >
          Create Workspace
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-quaternary border border-hover-teal text-octonary px-4 py-3 rounded-lg mb-6 shadow-md">
          {error}
        </div>
      )}

      {/* Owned Workspaces */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-septenary mb-4">Your Workspaces</h2>
        {ownedWorkspaces.length === 0 ? (
          <p className="text-senary">No workspaces created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedWorkspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace._id}
                workspace={workspace}
                onInvite={(ws) => {
                  setActiveWorkspace(ws);
                  setShowInviteModal(true);
                }}
                isOwned={true}
                onDelete={handleDeleteWorkspace}
                onUpdate={(ws) => {
                  setActiveWorkspace(ws);
                  setWorkspaceForm({ name: ws.name, isPublic: ws.isPublic });
                  setShowUpdateModal(true);
                }}
                onRemoveMember={handleRemoveMember}
              />
            ))}
          </div>
        )}
      </div>

      {/* Invited Workspaces */}
      <div>
        <h2 className="text-xl font-semibold text-septenary mb-4">Invited Workspaces</h2>
        {invitedWorkspaces.length === 0 ? (
          <p className="text-senary">No invited workspaces yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitedWorkspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace._id}
                workspace={workspace}
                isOwned={false}
                onRemoveMember={handleRemoveMember}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-tertiary p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-teal mb-4">Create New Workspace</h2>
            <form onSubmit={handleCreateWorkspace}>
              <input
                type="text"
                value={workspaceForm.name}
                onChange={(e) => setWorkspaceForm({ ...workspaceForm, name: e.target.value })}
                placeholder="Workspace Name"
                className="bg-quaternary text-octonary border border-senary p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-teal"
                required
              />
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  checked={workspaceForm.isPublic}
                  onChange={(e) => setWorkspaceForm({ ...workspaceForm, isPublic: e.target.checked })}
                  className="mr-2 h-4 w-4 text-teal border-senary rounded focus:ring-teal"
                />
                <label className="text-senary">Make Public</label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setWorkspaceForm({ name: "", isPublic: false });
                  }}
                  className="bg-quaternary text-octonary px-4 py-2 rounded-lg hover:bg-tertiary transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal text-background px-4 py-2 rounded-lg hover:bg-hover-teal transition-colors duration-200"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Workspace Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-tertiary p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-teal mb-4">Update Workspace</h2>
            <form onSubmit={handleUpdateWorkspace}>
              <input
                type="text"
                value={workspaceForm.name}
                onChange={(e) => setWorkspaceForm({ ...workspaceForm, name: e.target.value })}
                placeholder="Workspace Name"
                className="bg-quaternary text-octonary border border-senary p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-teal"
                required
              />
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  checked={workspaceForm.isPublic}
                  onChange={(e) => setWorkspaceForm({ ...workspaceForm, isPublic: e.target.checked })}
                  className="mr-2 h-4 w-4 text-teal border-senary rounded focus:ring-teal"
                />
                <label className="text-senary">Make Public</label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setActiveWorkspace(null);
                  }}
                  className="bg-quaternary text-octonary px-4 py-2 rounded-lg hover:bg-tertiary transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal text-background px-4 py-2 rounded-lg hover:bg-hover-teal transition-colors duration-200"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-tertiary p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-teal mb-4">
              Invite User to {activeWorkspace.name}
            </h2>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="User Email"
              className="bg-quaternary text-octonary border border-senary p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-teal"
              required
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setActiveWorkspace(null);
                }}
                className="bg-quaternary text-octonary px-4 py-2 rounded-lg hover:bg-tertiary transition-colors duration-200"
                >
                Cancel
              </button>
              <button
                onClick={handleInviteUser}
                className="bg-yellow text-background px-4 py-2 rounded-lg hover:bg-hover-yellow transition-colors duration-200"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspaces;