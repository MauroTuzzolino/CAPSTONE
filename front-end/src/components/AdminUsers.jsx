import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [confirmDelete, setConfirmDelete] = useState({ show: false, userId: null });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore nel recupero utenti");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      showToast("Errore nel recupero utenti", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore nell'eliminazione");
      showToast("Utente eliminato con successo", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("Errore nell'eliminazione", "error");
    }
  };

  const askDelete = (id) => {
    setConfirmDelete({ show: true, userId: id });
  };

  const closeConfirm = () => {
    setConfirmDelete({ show: false, userId: null });
  };

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

  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`http://localhost:3001/api/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Errore nell'aggiornamento");
      showToast("Utente aggiornato con successo", "success");
      handleClose();
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("Errore nell'aggiornamento utente", "error");
    }
  };

  const filteredUsers = users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mt-4 text-white">
      <h2 className="mb-4" style={{ borderBottom: "2px solid #00bfff", display: "inline-block", paddingBottom: "4px" }}>
        User Management
      </h2>

      <Form.Control
        type="text"
        placeholder="Cerca per username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3 rounded-pill bg-dark text-white border-light"
      />

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

      {/* Modal per modifica utente */}
      <Modal show={showModal} onHide={handleClose} centered className="text-dark">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <Form>
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
        <Modal.Body className="bg-dark">Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={closeConfirm}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDelete(confirmDelete.userId);
              closeConfirm();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast notifiche */}
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
