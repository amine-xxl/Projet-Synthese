import React, { useState, useEffect } from "react";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function ActualiteTable({ token }) {
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE = "http://127.0.0.1:8000/api";

  // --- CHARGEMENT DES DONNÉES ---
  const fetchActualites = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/actualites`, {
        headers: { Accept: "application/json" }
      });
      const data = await res.json(); // on s'assure que les données reçues sont bien un tableau avant de les stocker dans le state
      setActualites(Array.isArray(data) ? data : []); // si data n'est pas un tableau, on stocke un tableau vide pour éviter les erreurs d'affichage
    } catch (err) {
      console.error("Erreur chargement actualités:", err);
    } finally {
      setLoading(false);
    }
  };
// useEffect pour charger les actualités au chargement du composant
  useEffect(() => {
    fetchActualites();
  }, []);

  // --- ACTIONS ---
  const handleEdit = (item) => {
    navigate("/ajout-news", { 
      state: { activeTab: "actualites", editMode: true, editId: item.id, editData: item } 
      // on passe les données de l'actualité à éditer via le state de la navigation pour pré-remplir le formulaire
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette actualité ?")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/actualites/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchActualites();
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur suppression actualité:", err);
    }
  };

  // Utilitaire pour tronquer le contenu textuel
  const truncateText = (text, length = 60) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  if (loading) return <div className="text-center py-4"><div className="contact-spinner" /></div>;

  return (
    <table className="admin-custom-table">
      <thead>
        <tr>
          <th>Titre</th>
          <th>Contenu</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {actualites.length === 0 ? (
          <tr>
            <td colSpan="4" className="admin-table-empty">Aucune actualité trouvée.</td>
          </tr>
        ) : (
          actualites.map((item) => (
            <tr key={item.id}>
              <td className="fw-bold">{item.titre}</td>
              <td>{truncateText(item.contenu)}</td>
              <td>
                {item.image ? (
                  <img
                    src={item.image.startsWith("http") ? item.image : `http://127.0.0.1:8000${item.image}`}
                    alt={item.titre}
                    className="rounded-2"
                    style={{ width: 40, height: 40, objectFit: "cover" }}
                  />
                ) : (
                  <span className="text-muted small">Aucune</span>
                )}
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
