import React, { useState, useEffect } from "react";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function ActualiteTable({ token }) {
  // --- ÉTATS DU COMPOSANT ---
  const [actualites, setActualites] = useState([]); // Liste des actualités récupérées
  const [loading, setLoading] = useState(true);    // État de chargement (affiche un spinner si true)
  const navigate = useNavigate();

  // URL de base pour les requêtes API (public pour le fetch, admin pour le delete)
  const API_BASE = "http://127.0.0.1:8000/api";

  // --- CHARGEMENT DES DONNÉES ---

  /**
   * Récupère la liste complète des actualités depuis le serveur.
   */
  const fetchActualites = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/actualites`, {
        headers: { Accept: "application/json" }
      });
      const data = await res.json();
      // On s'assure que data est bien un tableau avant de mettre à jour l'état
      setActualites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors du chargement des actualités :", err);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // Chargement initial au montage du composant
  useEffect(() => {
    fetchActualites();
  }, []);

  // --- ACTIONS (ÉDITION & SUPPRESSION) ---

  /**
   * Redirige l'administrateur vers le formulaire d'édition avec les données pré-remplies.
   * @param {Object} item - L'actualité à modifier.
   */
  const handleEdit = (item) => {
    navigate("/ajout-news", { 
      state: { 
        activeTab: "actualites", 
        editMode: true, 
        editId: item.id, 
        editData: item 
      } 
    });
  };

  /**
   * Supprime une actualité du serveur après confirmation de l'utilisateur.
   * @param {number|string} id - L'ID de l'actualité à supprimer.
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette actualité ?")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/actualites/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        // En cas de succès, on rafraîchit la liste localement
        fetchActualites();
      } else {
        alert("Erreur serveur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur réseau lors de la suppression :", err);
    }
  };

  // --- UTILITAIRES DE RENDU ---

  /**
   * Tronque une chaîne de caractères trop longue pour l'affichage en tableau.
   * @param {string} text - Le texte à tronquer.
   * @param {number} length - Longueur maximale souhaitée.
   */
  const truncateText = (text, length = 60) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  // --- AFFICHAGE ---

  // Rendu du spinner pendant le chargement des données
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="contact-spinner" />
        <p className="mt-2 text-muted">Chargement des actualités...</p>
      </div>
    );
  }

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
          // Message si aucune donnée n'est disponible
          <tr>
            <td colSpan="4" className="admin-table-empty">Aucune actualité publiée pour le moment.</td>
          </tr>
        ) : (
          actualites.map((item) => (
            <tr key={item.id}>
              {/* Titre en gras pour plus de visibilité */}
              <td className="fw-bold">{item.titre}</td>
              
              {/* Contenu tronqué pour ne pas déformer le tableau */}
              <td>{truncateText(item.contenu)}</td>
              
              {/* Vignette de l'image (si elle existe) */}
              <td>
                {item.image ? (
                  <img
                    src={item.image.startsWith("http") ? item.image : `http://127.0.0.1:8000${item.image}`}
                    alt={item.titre}
                    className="rounded-2 shadow-sm"
                    style={{ width: 45, height: 45, objectFit: "cover" }}
                  />
                ) : (
                  <span className="text-muted small italic">Aucune</span>
                )}
              </td>

              {/* Boutons d'actions */}
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="admin-action-btn admin-action-btn--edit"
                    title="Modifier l'actualité"
                    onClick={() => handleEdit(item)}
                  >
                    <PencilFill size={13} />
                  </button>
                  <button
                    className="admin-action-btn admin-action-btn--delete"
                    title="Supprimer l'actualité"
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
