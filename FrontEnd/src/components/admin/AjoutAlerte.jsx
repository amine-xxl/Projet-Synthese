import React, { useState, useEffect } from "react";
import { CheckCircleFill, ExclamationTriangleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function AjoutAlerte({ token, isEditMode, editId, editData }) {
  const navigate = useNavigate();

  // --- ÉTATS DU FORMULAIRE ---
  const [lignes, setLignes] = useState([]); // Liste des lignes pour le select
  const [ligneId, setLigneId] = useState("");
  const [type, setType] = useState("info");
  const [statut, setStatut] = useState("active");
  const [message, setMessage] = useState("");
  
  // État de soumission (idle | loading | success | error)
  const [status, setStatus] = useState("idle");

  // --- CHARGEMENT INITIAL & PRÉ-REMPLISSAGE ---
  useEffect(() => {
    // 1. Charger les lignes pour la sélection
    fetch("http://127.0.0.1:8000/api/lignes")
      .then(res => res.json())
      .then(data => setLignes(Array.isArray(data) ? data : []))
      .catch(err => console.error("Erreur chargement lignes :", err));

    // 2. Si on est en mode édition, injecter les données existantes
    if (isEditMode && editData) {
      setMessage(editData.message || "");
      setType(editData.type || "info");
      setStatut(editData.statut || "active");
      setLigneId(editData.ligne_id || "");
    }
  }, [isEditMode, editData]);

  // --- ACTIONS (SOUMISSION) ---

  /**
   * Envoie les données de l'alerte au serveur.
   */
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
        body: JSON.stringify({ 
          ligne_id: ligneId, 
          type, 
          message, 
          statut 
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("Erreur serveur lors de la sauvegarde de l'alerte :", errData);
        setStatus("error");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setStatus("error");
    }
  };

  // --- RENDU CONDITIONNEL (STATUTS) ---

  // Succès
  if (status === "success") {
    return (
      <div className="text-center py-4">
        <CheckCircleFill size={56} className="text-success mb-3" />
        <h3 className="fw-bold">Alerte enregistrée avec succès !</h3>
        <p className="text-secondary">Les voyageurs recevront l'information instantanément.</p>
        <button 
          className="btn-ctf-primary mt-4 px-5" 
          onClick={() => navigate("/Admin")}
          style={{ borderRadius: "12px" }}
        >
          Terminer
        </button>
      </div>
    );
  }

  // Erreur
  if (status === "error") {
    return (
      <div className="text-center py-4">
        <ExclamationTriangleFill size={52} className="text-danger mb-3" />
        <h3 className="fw-bold">Erreur de publication</h3>
        <p className="text-secondary">Vérifiez la connexion au serveur et réessayez.</p>
        <button className="btn-ctf-primary mt-4 px-4" onClick={() => setStatus("idle")}>
          Réessayer
        </button>
      </div>
    );
  }

  // --- FORMULAIRE ---
  return (
    <form onSubmit={handleSubmit} className="position-relative">
      {/* Overlay de chargement */}
      {status === "loading" && (
        <div className="overlay-spinner">
          <div className="contact-spinner" />
          <p className="mt-2 fw-bold">Traitement de l'alerte...</p>
        </div>
      )}

      {/* Sélection de la ligne */}
      <div className="mb-3">
        <label className="contact-label">Ligne concernée par l'alerte</label>
        <select 
          className="contact-input" 
          value={ligneId} 
          onChange={(e) => setLigneId(e.target.value)} 
          required
        >
          <option value="">-- Sélectionnez une ligne de bus --</option>
          {lignes.map((l) => (
            <option key={l.id} value={l.id}>
              Ligne {l.numero} — {l.depart} → {l.arrivee}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        {/* Type d'alerte */}
        <div className="col-md-6 mb-3">
          <label className="contact-label">Nature de l'alerte</label>
          <select className="contact-input" value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="info">📢 Information</option>
            <option value="retard">⏳ Retard</option>
            <option value="perturbation">⚠️ Perturbation / Travaux</option>
          </select>
        </div>

        {/* Statut actuel */}
        <div className="col-md-6 mb-3">
          <label className="contact-label">Statut de l'alerte</label>
          <select className="contact-input" value={statut} onChange={(e) => setStatut(e.target.value)} required>
            <option value="active">🔴 Active (En cours)</option>
            <option value="resolue">🟢 Résolue (Terminée)</option>
          </select>
        </div>
      </div>

      {/* Message détaillé */}
      <div className="mb-3">
        <label className="contact-label">Message aux voyageurs</label>
        <textarea 
          className="contact-input" 
          rows="4" 
          value={message} 
          placeholder="Ex: Le bus de 14h30 aura un retard de 10 minutes suite à des travaux..." 
          onChange={(e) => setMessage(e.target.value)} 
          required 
        />
      </div>

      {/* Bouton de validation */}
      <button 
        type="submit" 
        className="btn-ctf-primary w-100 py-3 mt-3 shadow-sm" 
        disabled={status === "loading"}
        style={{ borderRadius: "14px" }}
      >
        {isEditMode ? "Enregistrer les modifications" : "Publier l'alerte réseau"}
      </button>
    </form>
  );
}
