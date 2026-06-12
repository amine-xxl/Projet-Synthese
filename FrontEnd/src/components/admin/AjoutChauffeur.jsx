import React, { useState, useEffect } from "react";
import { BusFrontFill, PeopleFill, GeoAltFill, CurrencyDollar, TruckFlatbed, Link45deg, CheckCircleFill, ExclamationTriangleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

/**
 * Composant AjoutChauffeur
 * 
 * Ce composant permet d'affecter un utilisateur (rôle chauffeur) à une ligne
 * spécifique et de définir les caractéristiques techniques de son véhicule.
 * Il gère de manière autonome la récupération des lignes et des chauffeurs disponibles.
 * 
 * @param {Object} props
 * @param {string} props.token - Jeton d'authentification pour l'API Admin.
 * @param {boolean} props.isEditMode - Indique si on modifie une affectation existante.
 * @param {Object} props.editData - Données du chauffeur/véhicule pour l'édition.
 */
export default function AjoutChauffeur({ token, isEditMode, editData }) {
  const navigate = useNavigate();

  // --- ÉTATS ---
  const [lignes, setLignes] = useState([]);         // Liste des lignes de bus
  const [chauffeurs, setChauffeurs] = useState([]); // Liste des utilisateurs chauffeurs
  const [status, setStatus] = useState("idle");     // idle | loading | success | error

  // États du formulaire d'affectation
  const [chfUserId, setChfUserId] = useState("");
  const [chfLigneId, setChfLigneId] = useState("");
  const [chfBusNum, setChfBusNum] = useState("");
  const [chfModele, setChfModele] = useState("");
  const [chfCapacite, setChfCapacite] = useState(15);
  const [chfTrajet, setChfTrajet] = useState("");
  const [chfTarif, setChfTarif] = useState(5);

  // --- CHARGEMENT DES DONNÉES ---

  useEffect(() => {
    // 1. Récupérer les lignes disponibles (API publique)
    fetch("http://127.0.0.1:8000/api/lignes")
      .then(res => res.json())
      .then(data => setLignes(Array.isArray(data) ? data : []));

    // 2. Récupérer les chauffeurs inscrits (API Admin)
    fetch("http://127.0.0.1:8000/api/admin/chauffeurs", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setChauffeurs(Array.isArray(data) ? data : []));

    // 3. Mode édition : Injection des données professionnelles existantes
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

  // --- ACTIONS (SOUMISSION) ---

  /**
   * Valide l'affectation ou la modification des informations pro du chauffeur.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/chauffeurs", {
        method: "POST", // On utilise un endpoint 'updateOrCreate' côté Laravel
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: chfUserId,
          ligne_id: chfLigneId,
          numero_bus: chfBusNum,
          modele: chfModele,
          capacite: chfCapacite,
          trajet: chfTrajet,
          tarif: chfTarif,
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("Erreur d'affectation :", errData);
        setStatus("error");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setStatus("error");
    }
  };

  // --- RENDU CONDITIONNEL (STATUTS) ---

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <CheckCircleFill size={56} className="text-success mb-3" />
        <h3 className="fw-bold">Affectation validée !</h3>
        <p className="text-secondary">Les informations du chauffeur ont été mises à jour.</p>
        <button 
          className="btn-ctf-primary mt-4 px-5" 
          onClick={() => navigate("/Affectation")}
          style={{ borderRadius: "12px" }}
        >
          Voir les affectations
        </button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-4">
        <ExclamationTriangleFill size={52} className="text-danger mb-3" />
        <h3 className="fw-bold">Erreur d'affectation</h3>
        <p className="text-secondary">Vérifiez que tous les champs sont valides.</p>
        <button className="btn-ctf-primary mt-4 px-4" onClick={() => setStatus("idle")}>
          Réessayer
        </button>
      </div>
    );
  }

  // --- FORMULAIRE D'AFFECTATION ---
  return (
    <form onSubmit={handleSubmit} className="position-relative">
      {status === "loading" && (
        <div className="overlay-spinner">
          <div className="contact-spinner" />
          <p className="mt-2 fw-bold">Affectation en cours...</p>
        </div>
      )}
      
      {/* En-tête : Sélection ou affichage du chauffeur cible */}
      <div className="mb-4 p-3 admin-form-header rounded-3 d-flex align-items-center gap-3">
        <div className="navbar-user-initial shadow-sm" style={{ width: 52, height: 52, fontSize: "22px" }}>
          {editData?.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div className="flex-grow-1">
          {isEditMode ? (
            // En mode édition, on ne change pas le chauffeur cible
            <>
              <h5 className="mb-0 fw-bold">{editData?.name}</h5>
              <small className="text-muted">{editData?.email}</small>
            </>
          ) : (
            // En mode création, on choisit parmi les chauffeurs enregistrés
            <>
              <label className="contact-label small mb-1">Choisir un chauffeur</label>
              <select 
                className="contact-input" 
                value={chfUserId} 
                onChange={(e) => setChfUserId(e.target.value)} 
                required
              >
                <option value="">-- Sélectionnez un agent --</option>
                {chauffeurs.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Grille des caractéristiques du véhicule et du trajet */}
      <div className="row g-3">
        <div className="col-md-6">
          <label className="contact-label"><BusFrontFill className="me-1" /> Ligne assignée</label>
          <select 
            className="contact-input" 
            value={chfLigneId} 
            onChange={(e) => setChfLigneId(e.target.value)} 
            required
          >
            <option value="">-- Sélectionner une ligne --</option>
            {lignes.map(l => (
              <option key={l.id} value={l.id}>Ligne {l.numero} ({l.depart})</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="contact-label"><TruckFlatbed className="me-1" /> Numéro du Bus</label>
          <input 
            className="contact-input" 
            value={chfBusNum} 
            placeholder="Ex: BUS-750" 
            onChange={(e) => setChfBusNum(e.target.value)} 
            required 
          />
        </div>

        <div className="col-md-6">
          <label className="contact-label">Modèle du véhicule</label>
          <select className="contact-input" value={chfModele} onChange={(e) => setChfModele(e.target.value)} required>
            <option value="">-- Choisir un modèle --</option>
            <option value="Yutong ZK6128BEVG">🔋 Yutong ZK6128BEVG (Électrique)</option>
            <option value="Yutong ZK6126HG">⛽ Yutong ZK6126HG (Diesel)</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="contact-label">Capacité passagers</label>
          <input 
            type="number" 
            min="1" 
            className="contact-input" 
            value={chfCapacite} 
            onChange={(e) => setChfCapacite(e.target.value)} 
            required 
          />
        </div>

        <div className="col-md-12">
          <label className="contact-label"><GeoAltFill className="me-1" /> Description du Trajet</label>
          <input 
            className="contact-input" 
            value={chfTrajet} 
            placeholder="Ex: Route Principale de Fès vers Sefrou..." 
            onChange={(e) => setChfTrajet(e.target.value)} 
            required 
          />
        </div>
      </div>

      {/* Bouton de validation final */}
      <button 
        type="submit" 
        className="btn-ctf-primary w-100 py-3 mt-4 shadow-sm" 
        style={{ borderRadius: "14px", fontSize: "17px" }}
      >
        <Link45deg size={22} className="me-2" /> 
        {isEditMode ? "Mettre à jour l'affectation" : "Confirmer l'affectation"}
      </button>
    </form>
  );
}
