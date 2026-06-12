import React, { useState, useEffect } from "react";
import { TrashFill } from "react-bootstrap-icons";

export default function MessageTable({ token }) {
  // --- ÉTATS ---
  const [messages, setMessages] = useState([]); // Liste des messages
  const [loading, setLoading] = useState(true);   // État de chargement

  // URL spécifique aux messages administratifs
  const API_URL = "http://127.0.0.1:8000/api/admin";

  // --- CHARGEMENT DES DONNÉES ---

  /**
   * Récupère la liste des messages de contact depuis l'API sécurisée.
   */
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/messages`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}` // Authentification obligatoire
        }
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors de la récupération des messages :", err);
    } finally {
      setLoading(false);
    }
  };

  // Recharger si le token change ou au chargement initial
  useEffect(() => {
    if (token) fetchMessages();
  }, [token]);

  // --- ACTIONS (SUPPRESSION UNIQUEMENT) ---

  /**
   * Supprime un message définitivement.
   * @param {number|string} id - L'ID du message à supprimer.
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ? Cette action est irréversible.")) return;

    try {
      const res = await fetch(`${API_URL}/messages/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        // Mise à jour de la liste locale
        fetchMessages();
      } else {
        alert("Une erreur s'est produite lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur réseau (suppression message) :", err);
    }
  };

  // --- RENDU ---

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="contact-spinner" />
        <p className="mt-2 text-muted small">Récupération des messages entrants...</p>
      </div>
    );
  }

  return (
    <table className="admin-custom-table">
      <thead>
        <tr>
          <th>Expéditeur</th>
          <th>Email</th>
          <th>Sujet</th>
          <th>Contenu du message</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {messages.length === 0 ? (
          // Message si la boîte de réception est vide
          <tr>
            <td colSpan="5" className="admin-table-empty">Aucun message reçu pour le moment.</td>
          </tr>
        ) : (
          messages.map((item) => (
            <tr key={item.id}>
              {/* Nom de l'expéditeur */}
              <td className="fw-bold">{item.nom}</td>
              
              {/* Email de l'expéditeur (petite taille) */}
              <td className="small">{item.email}</td>
              
              {/* Sujet du message */}
              <td className="text-primary">{item.sujet}</td>
              
              {/* Contenu textuel avec style discret */}
              <td className="small text-muted text-wrap" style={{ maxWidth: "300px" }}>
                {item.message}
              </td>

              {/* Bouton de suppression */}
              <td>
                <button
                  className="admin-action-btn admin-action-btn--delete"
                  title="Supprimer ce message"
                  onClick={() => handleDelete(item.id)}
                >
                  <TrashFill size={13} />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
