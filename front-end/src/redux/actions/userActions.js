// ------------------------ FETCH USERS (ADMIN) ------------------------
export const fetchUsers = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    dispatch({ type: "USERS_LOADING" });

    const res = await fetch("http://localhost:3001/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Errore nel caricamento utenti");
    }

    const users = await res.json();
    dispatch({ type: "USERS_LOADED", payload: users });
  } catch (err) {
    console.error(err);
    dispatch({ type: "USERS_ERROR", payload: err.message });
  }
};

// ------------------------ UPDATE USER ------------------------
export const updateUser = (userData) => async (dispatch, getState) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    dispatch({ type: "USER_UPDATE_REQUEST" });

    // Prendi l'ID dell'utente loggato dallo state Redux
    const { user } = getState().auth;
    if (!user) throw new Error("Utente non loggato");

    const res = await fetch(`http://localhost:3001/api/users/${user.id}`, {
      method: "PATCH", // PATCH per partial update
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Errore durante l'aggiornamento");
    }

    const updatedUser = await res.json();
    dispatch({ type: "USER_LOADED", payload: updatedUser });
  } catch (err) {
    console.error(err);
    dispatch({ type: "USER_UPDATE_FAIL", payload: err.message });
  }
};

// ------------------------ DELETE USER (ADMIN) ------------------------
export const deleteUser = (userId) => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    dispatch({ type: "USER_DELETE_REQUEST" });

    const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Errore durante la cancellazione");
    }

    dispatch({ type: "USER_DELETED", payload: userId });
  } catch (err) {
    console.error(err);
    dispatch({ type: "USER_DELETE_FAIL", payload: err.message });
  }
};
