import React, { useState, useEffect } from "react";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

/**
 * Composant LigneTable
 * Affiche la liste des lignes de bus dans un tableau.
 * Gère lui-même la récupération des données et la suppression d'une ligne.
 * 
 * @param {Object} props
 * @param {string} props.token - Token d'authentification pour les actions sensibles.
 */
export default function LigneTable({ token }) {
  const [lignes, setLignes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // URL de base pour les lignes
  const API_BASE = "http://127.0.0.1:8000/api";

  // --- CHARGEMENT DES DONNÉES ---
  const fetchLignes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/lignes`, {
        headers: { Accept: "application/json" }
      });
      const data = await res.json();
      setLignes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors du chargement des lignes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLignes();
  }, []);

  // --- ACTIONS ---

  // Redirection vers la page d'édition
  const handleEdit = (item) => {
    navigate("/ajout-news", { 
      state: { activeTab: "lignes", editMode: true, editId: item.id, editData: item } 
    });
  };

  // Suppression d'une ligne après confirmation
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette ligne ?")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/lignes/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        // Recharger la liste après suppression
        fetchLignes();
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur suppression ligne:", err);
    }
  };

  // Utilitaire pour tronquer le texte long
  const truncateText = (text, length = 60) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  if (loading) return <div className="text-center py-4"><div className="contact-spinner" /></div>;

  return (
    <table className="admin-custom-table">
      <thead>
        <tr>
          <th>Numéro</th>
          <th>Départ</th>
          <th>Arrivée</th>
          <th>Prix</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {lignes.length === 0 ? (
          <tr>
            <td colSpan="6" className="admin-table-empty">Aucune ligne trouvée.</td>
          </tr>
        ) : (
          lignes.map((item) => (
            <tr key={item.id}>
              <td>{item.numero}</td>
              <td>{item.depart}</td>
              <td>{item.arrivee}</td>
              <td>{item.prix} MAD</td>
              <td>{truncateText(item.description)}</td>
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
