import React, { useState, useEffect } from "react";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

/**
 * Composant AlerteTable
 * Affiche la liste des alertes dans un tableau.
 * Gère lui-même la récupération des données et la suppression d'une alerte.
 * 
 * @param {Object} props
 * @param {string} props.token - Token d'authentification.
 */
export default function AlerteTable({ token }) {
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE = "http://127.0.0.1:8000/api";

  // --- CHARGEMENT DES DONNÉES ---
  const fetchAlertes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/alertes`, {
        headers: { Accept: "application/json" }
      });
      const data = await res.json();
      setAlertes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement alertes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertes();
  }, []);

  // --- ACTIONS ---

  const handleEdit = (item) => {
    navigate("/ajout-news", { 
      state: { activeTab: "alertes", editMode: true, editId: item.id, editData: item } 
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette alerte ?")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/alertes/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchAlertes();
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur suppression alerte:", err);
    }
  };

  if (loading) return <div className="text-center py-4"><div className="contact-spinner" /></div>;

  return (
    <table className="admin-custom-table">
      <thead>
        <tr>
          <th>Ligne</th>
          <th>Type</th>
          <th>Message</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {alertes.length === 0 ? (
          <tr>
            <td colSpan="5" className="admin-table-empty">Aucune alerte trouvée.</td>
          </tr>
        ) : (
          alertes.map((item) => (
            <tr key={item.id}>
              <td className="fw-bold">
                {item.ligne ? `Ligne ${item.ligne.numero}` : `ID: ${item.ligne_id}`}
              </td>
              <td>
                <span className={`badge-type badge-type--${item.type}`}>
                  {item.type}
                </span>
              </td>
              <td className="small">{item.message}</td>
              <td>
                <span className={`badge-statut badge-statut--${item.statut}`}>
                  {item.statut === "active" ? "En cours" : "Résolue"}
                </span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="admin-action-btn admin-action-btn--edit"
                    title="Modifier"
                    onClick={() => handleEdit(item)}
                  >
                    <PencilFill size={13} />
                  </button>
                  <button
                    className="admin-action-btn admin-action-btn--delete"
                    title="Supprimer"
                    onClick={() => handleDelete(item.id)}
                  >
                    <TrashFill size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
