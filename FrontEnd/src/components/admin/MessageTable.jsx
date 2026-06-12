import React, { useState, useEffect } from "react";
import { TrashFill } from "react-bootstrap-icons";

/**
 * Composant MessageTable
 * Affiche la liste des messages reçus via le formulaire de contact.
 * Gère lui-même la récupération des données et la suppression d'un message.
 * 
 * @param {Object} props
 * @param {string} props.token - Token d'authentification (nécessaire car les messages sont privés).
 */
export default function MessageTable({ token }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://127.0.0.1:8000/api/admin";

  // --- CHARGEMENT DES DONNÉES ---
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/messages`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  // --- ACTIONS ---

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;

    try {
      const res = await fetch(`${API_URL}/messages/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchMessages();
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur suppression message:", err);
    }
  };

  if (loading) return <div className="text-center py-4"><div className="contact-spinner" /></div>;

  return (
    <table className="admin-custom-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Sujet</th>
          <th>Message</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {messages.length === 0 ? (
          <tr>
            <td colSpan="5" className="admin-table-empty">Aucun message reçu.</td>
          </tr>
        ) : (
          messages.map((item) => (
            <tr key={item.id}>
              <td>{item.nom}</td>
              <td className="small">{item.email}</td>
              <td className="fw-bold">{item.sujet}</td>
              <td className="small text-muted">{item.message}</td>
              <td>
                <button
                  className="admin-action-btn admin-action-btn--delete"
                  title="Supprimer"
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
