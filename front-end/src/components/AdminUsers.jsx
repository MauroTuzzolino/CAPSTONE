import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, updateUserAdmin } from "../redux/actions/userActions";

const AdminUsers = () => {
  const dispatch = useDispatch();

  // Stato globale Redux
  const { users, loading, error } = useSelector((state) => state.users);

  // Stato locale solo per UI
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [confirmDelete, setConfirmDelete] = useState({ show: false, userId: null });

  // Carica utenti all'inizio
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Mostra un toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  // Apri modal modifica
  const openModal = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setShowModal(true);
  };

  // Chiudi modal
  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Cambio valori form
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Salva modifiche
  const handleSave = () => {
    if (!selectedUser) return;
    dispatch(updateUserAdmin(selectedUser.id, formData));
    showToast("Utente aggiornato con successo", "success");
    handleClose();
  };

  // Conferma eliminazione
  const askDelete = (id) => {
    setConfirmDelete({ show: true, userId: id });
  };

  const closeConfirm = () => {
    setConfirmDelete({ show: false, userId: null });
  };

  const handleDelete = () => {
    dispatch(deleteUser(confirmDelete.userId));
    showToast("Utente eliminato con successo", "success");
    closeConfirm();
  };

  // Filtra utenti
  const filteredUsers = users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mt-4 text-white">
      <h2 className="mb-4" style={{ borderBottom: "2px solid #00bfff", display: "inline-block", paddingBottom: "4px" }}>
        User Management
      </h2>

      {/* Campo ricerca */}
      <Form.Control
        type="text"
        placeholder="Cerca per username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3 rounded-pill bg-dark text-white border-light"
      />

      {/* Loading / Error */}
      {loading && <div className="text-info">Caricamento utenti...</div>}
      {error && <div className="text-danger">{error}</div>}

      {/* Tabella utenti */}
      <table className="table table-hover table-dark rounded shadow-sm">
        <thead className="table-secondary text-dark">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} onClick={() => openModal(user)} style={{ cursor: "pointer" }}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    askDelete(user.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal modifica utente */}
      <Modal show={showModal} onHide={handleClose} centered className="text-dark">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <Form className="text-dark">
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control name="firstName" value={formData.firstName || ""} onChange={handleChange} className="rounded" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Surname</Form.Label>
              <Form.Control name="lastName" value={formData.lastName || ""} onChange={handleChange} className="rounded" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Username</Form.Label>
              <Form.Control name="username" value={formData.username || ""} onChange={handleChange} className="rounded" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={formData.email || ""} onChange={handleChange} className="rounded" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" value={formData.role || "USER"} onChange={handleChange} className="rounded">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal conferma eliminazione */}
      <Modal show={confirmDelete.show} onHide={closeConfirm} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={closeConfirm}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast */}
      {toast.show && (
        <div aria-live="polite" aria-atomic="true" style={{ position: "fixed", top: 20, right: 20, zIndex: 1050 }}>
          <div className={`toast show text-white ${toast.type === "success" ? "bg-success" : "bg-danger"}`}>
            <div className="toast-body">{toast.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
