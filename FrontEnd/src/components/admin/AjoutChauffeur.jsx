import React, { useState, useEffect } from "react";
import { BusFrontFill, PeopleFill, GeoAltFill, CurrencyDollar, TruckFlatbed, Link45deg, CheckCircleFill, ExclamationTriangleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

/**
 * Composant AjoutChauffeur
 * Gère l'affectation des chauffeurs de manière autonome.
 */
export default function AjoutChauffeur({ token, isEditMode, editData }) {
  const navigate = useNavigate();

  // --- ÉTATS ---
  const [lignes, setLignes] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [status, setStatus] = useState("idle");

  const [chfUserId, setChfUserId] = useState("");
  const [chfLigneId, setChfLigneId] = useState("");
  const [chfBusNum, setChfBusNum] = useState("");
  const [chfModele, setChfModele] = useState("");
  const [chfCapacite, setChfCapacite] = useState(15);
  const [chfTrajet, setChfTrajet] = useState("");
  const [chfTarif, setChfTarif] = useState(5);

  // --- CHARGEMENT ---
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/lignes")
      .then(res => res.json())
      .then(data => setLignes(Array.isArray(data) ? data : []));

    fetch("http://127.0.0.1:8000/api/admin/chauffeurs", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setChauffeurs(Array.isArray(data) ? data : []));

    if (isEditMode && editData) {
      setChfUserId(editData.id);
      if (editData.pro_info) {
        setChfLigneId(editData.pro_info.ligne_id || "");
        setChfBusNum(editData.pro_info.numero_bus || "");
        setChfModele(editData.pro_info.modele || "");
        setChfCapacite(editData.pro_info.capacite || 15);
        setChfTrajet(editData.pro_info.trajet || "");
        setChfTarif(editData.pro_info.tarif || 5);
      }
    }
  }, [isEditMode, editData, token]);

  // --- SOUMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/chauffeurs", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: chfUserId, ligne_id: chfLigneId, numero_bus: chfBusNum,
          modele: chfModele, capacite: chfCapacite, trajet: chfTrajet, tarif: chfTarif,
        }),
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
        <h3>Affectation effectuée avec succès !</h3>
        <button className="btn-ctf-primary mt-4" onClick={() => navigate("/Affectation")}>Terminer</button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-4">
        <ExclamationTriangleFill size={52} className="text-danger mb-3" />
        <h3>Erreur lors de l'affectation</h3>
        <button className="btn-ctf-primary mt-4" onClick={() => setStatus("idle")}>Réessayer</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === "loading" && <div className="overlay-spinner"><div className="contact-spinner" /></div>}
      
      <div className="mb-4 p-3 admin-form-header rounded-3 d-flex align-items-center gap-3">
        <div className="navbar-user-initial" style={{ width: 48, height: 48 }}>
          {editData?.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div className="flex-grow-1">
          {isEditMode ? (
            <><h5>{editData?.name}</h5><small>{editData?.email}</small></>
          ) : (
            <>
              <label className="contact-label small">Chauffeur</label>
              <select className="contact-input" value={chfUserId} onChange={(e) => setChfUserId(e.target.value)} required>
                <option value="">-- Sélectionner --</option>
                {chauffeurs.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
            </>
          )}
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="contact-label"><BusFrontFill className="me-1" /> Ligne</label>
          <select className="contact-input" value={chfLigneId} onChange={(e) => setChfLigneId(e.target.value)} required>
            <option value="">-- Sélectionner --</option>
            {lignes.map(l => <option key={l.id} value={l.id}>Ligne {l.numero}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label className="contact-label"><TruckFlatbed className="me-1" /> Numéro Bus</label>
          <input className="contact-input" value={chfBusNum} onChange={(e) => setChfBusNum(e.target.value)} required />
        </div>
        <div className="col-md-6">
          <label className="contact-label">Modèle</label>
          <select className="contact-input" value={chfModele} onChange={(e) => setChfModele(e.target.value)} required>
            <option value="">-- Choisir --</option>
            <option value="Yutong ZK6128BEVG">Yutong Électrique</option>
            <option value="Yutong ZK6126HG">Yutong Diesel</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="contact-label">Capacité</label>
          <input type="number" className="contact-input" value={chfCapacite} onChange={(e) => setChfCapacite(e.target.value)} required />
        </div>
        <div className="col-md-12">
          <label className="contact-label"><GeoAltFill className="me-1" /> Trajet</label>
          <input className="contact-input" value={chfTrajet} onChange={(e) => setChfTrajet(e.target.value)} required />
        </div>
      </div>

      <button type="submit" className="btn-ctf-primary w-100 py-2 mt-4">
        <Link45deg size={20} className="me-2" /> Valider l'affectation
      </button>
    </form>
  );
}
