import "../../styles/CreateWorkspaceModal.css";

function CreateWorkspaceModal({ onClose, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.workspaceName.value.trim();
    if (!name) return;
    onSubmit(name);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        <h3>Create New Workspace</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="workspaceName"
            type="text"
            placeholder="Workspace name"
            className="modal-input"
          />

          <div className="modal-buttons">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkspaceModal;
