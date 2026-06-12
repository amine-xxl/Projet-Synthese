import React, { useState, useEffect } from "react";
import { CheckCircleFill, ExclamationTriangleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

/**
 * Composant AjoutAlerte
 * Gère tout de A à Z : chargement des lignes, saisie de l'alerte et messages de statut.
 */
export default function AjoutAlerte({ token, isEditMode, editId, editData }) {
  const navigate = useNavigate();

  // --- ÉTATS ---
  const [lignes, setLignes] = useState([]);
  const [ligneId, setLigneId] = useState("");
  const [type, setType] = useState("info");
  const [statut, setStatut] = useState("active");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  // --- CHARGEMENT ---
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/lignes")
      .then(res => res.json())
      .then(data => setLignes(Array.isArray(data) ? data : []));

    if (isEditMode && editData) {
      setMessage(editData.message || "");
      setType(editData.type || "info");
      setStatut(editData.statut || "active");
      setLigneId(editData.ligne_id || "");
    }
  }, [isEditMode, editData]);

  // --- SOUMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const endpoint = isEditMode ? `/alertes/${editId}` : "/alertes";
      const method = isEditMode ? "PUT" : "POST";
      const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
        method,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ligne_id: ligneId, type, message, statut }),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  // --- RENDU STATUT ---

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <CheckCircleFill size={56} className="text-success mb-3" />
        <h3>Alerte enregistrée !</h3>
        <button className="btn-ctf-primary mt-4" onClick={() => navigate("/Admin")}>Terminer</button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-4">
        <ExclamationTriangleFill size={52} className="text-danger mb-3" />
        <h3>Erreur serveur</h3>
        <button className="btn-ctf-primary mt-4" onClick={() => setStatus("idle")}>Réessayer</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === "loading" && <div className="overlay-spinner"><div className="contact-spinner" /></div>}
      <div className="mb-3">
        <label className="contact-label">Ligne concernée</label>
        <select className="contact-input" value={ligneId} onChange={(e) => setLigneId(e.target.value)} required>
          <option value="">-- Choisissez une ligne --</option>
          {lignes.map((l) => (
            <option key={l.id} value={l.id}>Ligne {l.numero} ({l.depart} → {l.arrivee})</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="contact-label">Type d'alerte</label>
        <select className="contact-input" value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="info">Information</option>
          <option value="retard">Retard</option>
          <option value="perturbation">Perturbation</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="contact-label">Statut</label>
        <select className="contact-input" value={statut} onChange={(e) => setStatut(e.target.value)} required>
          <option value="active">Active</option>
          <option value="resolue">Résolue</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="contact-label">Message</label>
        <textarea className="contact-input" rows="3" value={message} onChange={(e) => setMessage(e.target.value)} required />
      </div>
      <button type="submit" className="btn-ctf-primary w-100 py-2 mt-2">
        {isEditMode ? "Mettre à jour" : "Créer l'alerte"}
      </button>
    </form>
  );
}
