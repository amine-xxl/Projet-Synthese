import React, { useState, useEffect } from "react";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function AlerteTable({ token }) {
  // --- ÉTATS DU COMPOSANT ---
  const [alertes, setAlertes] = useState([]); // Liste des alertes récupérées
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const navigate = useNavigate();

  // URL de base de l'API
  const API_BASE = "http://127.0.0.1:8000/api";

  // --- CHARGEMENT DES DONNÉES ---

  /**
   * Récupère toutes les alertes depuis le serveur.
   */
  const fetchAlertes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/alertes`, {
        headers: { Accept: "application/json" }
      });
      const data = await res.json();
      setAlertes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors du chargement des alertes :", err);
    } finally {
      setLoading(false);
    }
  };

  // Chargement des données au premier rendu
  useEffect(() => {
    fetchAlertes();
  }, []);

  // --- ACTIONS (ÉDITION & SUPPRESSION) ---

  /**
   * Redirige vers le formulaire d'ajout/modification en injectant les données de l'alerte sélectionnée.
   * @param {Object} item - L'alerte à éditer.
   */
  const handleEdit = (item) => {
    navigate("/ajout-news", { 
      state: { 
        activeTab: "alertes", 
        editMode: true, 
        editId: item.id, 
        editData: item 
      } 
    });
  };

  /**
   * Supprime une alerte de la base de données.
   * @param {number|string} id - L'ID de l'alerte à supprimer.
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette alerte ?")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/alertes/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        // Rafraîchissement automatique de la liste
        fetchAlertes();
      } else {
        alert("Une erreur est survenue lors de la suppression de l'alerte.");
      }
    } catch (err) {
      console.error("Erreur réseau (suppression alerte) :", err);
    }
  };

  // --- RENDU ---

  // État de chargement
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="contact-spinner" />
        <p className="mt-2 text-muted small">Récupération des alertes en cours...</p>
      </div>
    );
  }

  return (
    <table className="admin-custom-table">
      <thead>
        <tr>
          <th>Ligne</th>
          <th>Type d'alerte</th>
          <th>Message</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {alertes.length === 0 ? (
          // Cas où aucune alerte n'est trouvée
          <tr>
            <td colSpan="5" className="admin-table-empty">Aucune alerte enregistrée.</td>
          </tr>
        ) : (
          alertes.map((item) => (
            <tr key={item.id}>
              {/* Informations sur la ligne concernée */}
              <td className="fw-bold">
                {item.ligne ? `Ligne ${item.ligne.numero}` : `ID Ligne: ${item.ligne_id}`}
              </td>

              {/* Badge stylisé selon le type d'alerte */}
              <td>
                <span className={`badge-type badge-type--${item.type}`}>
                  {item.type.toUpperCase()}
                </span>
              </td>

              {/* Message de l'alerte (petit format) */}
              <td className="small text-wrap" style={{ maxWidth: "250px" }}>
                {item.message}
              </td>

              {/* Badge d'état (Active ou Résolue) */}
              <td>
                <span className={`badge-statut badge-statut--${item.statut}`}>
                  {item.statut === "active" ? "🔴 En cours" : "🟢 Résolue"}
                </span>
              </td>

              {/* Boutons d'actions groupés */}
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="admin-action-btn admin-action-btn--edit"
                    title="Modifier l'alerte"
                    onClick={() => handleEdit(item)}
                  >
                    <PencilFill size={13} />
                  </button>
                  <button
                    className="admin-action-btn admin-action-btn--delete"
                    title="Supprimer l'alerte"
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
