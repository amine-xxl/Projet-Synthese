import React, { useState, useEffect } from "react";
import { TrashFill, PlusLg, CheckCircleFill, ExclamationTriangleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

/**
 * Composant AjoutLigne
 * Gère tout le cycle de vie du formulaire des lignes : saisie, validation, envoi et messages de retour.
 */
export default function AjoutLigne({ token, isEditMode, editId, editData }) {
  const navigate = useNavigate();

  // --- ÉTATS DU FORMULAIRE ---
  const [numero, setNumero] = useState("");
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [prix, setPrix] = useState(5.00);
  const [description, setDescription] = useState("");
  const [arretsAller, setArretsAller] = useState([""]);
  const [arretsRetour, setArretsRetour] = useState([""]);

  // État local pour gérer l'affichage du succès/erreur/chargement
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  // --- PRÉ-REMPLISSAGE ---
  useEffect(() => {
    if (isEditMode && editData) {
      setNumero(editData.numero || "");
      setDepart(editData.depart || "");
      setArrivee(editData.arrivee || "");
      setPrix(editData.prix || 5.00);
      setDescription(editData.description || "");
      if (editData.itineraires) {
        const aller = editData.itineraires.filter(i => i.direction === "aller").map(i => i.nom_arret);
        const retour = editData.itineraires.filter(i => i.direction === "retour").map(i => i.nom_arret);
        setArretsAller(aller.length > 0 ? aller : [""]);
        setArretsRetour(retour.length > 0 ? retour : [""]);
      }
    }
  }, [isEditMode, editData]);

  // --- GESTION DES ARRÊTS ---
  const handleAddStop = (dir) => {
    if (dir === "aller") setArretsAller([...arretsAller, ""]);
    else setArretsRetour([...arretsRetour, ""]);
  };
  const handleRemoveStop = (dir, index) => {
    if (dir === "aller") setArretsAller(arretsAller.filter((_, i) => i !== index));
    else setArretsRetour(arretsRetour.filter((_, i) => i !== index));
  };
  const handleUpdateStop = (dir, index, val) => {
    const arr = dir === "aller" ? [...arretsAller] : [...arretsRetour];
    arr[index] = val;
    dir === "aller" ? setArretsAller(arr) : setArretsRetour(arr);
  };

  // --- SOUMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const endpoint = isEditMode ? `/lignes/${editId}` : "/lignes";
      const method = isEditMode ? "PUT" : "POST";
      const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
        method,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          numero, depart, arrivee, prix, description,
          arrets_aller: arretsAller.filter(Boolean),
          arrets_retour: arretsRetour.filter(Boolean),
        }),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  // --- RENDU CONDITIONNEL SELON LE STATUT ---

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <CheckCircleFill size={56} className="text-success mb-3" />
        <h3>Ligne enregistrée avec succès !</h3>
        <button className="btn-ctf-primary mt-4" onClick={() => navigate("/Admin")}>Terminer</button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-4">
        <ExclamationTriangleFill size={52} className="text-danger mb-3" />
        <h3>Erreur de sauvegarde</h3>
        <p>Veuillez vérifier les informations saisies.</p>
        <button className="btn-ctf-primary mt-4" onClick={() => setStatus("idle")}>Réessayer</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === "loading" && <div className="overlay-spinner"><div className="contact-spinner" /></div>}
      
      <div className="mb-3">
        <label className="contact-label">Numéro de ligne</label>
        <input className="contact-input" value={numero} onChange={(e) => setNumero(e.target.value)} required />
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="contact-label">Départ</label>
          <input className="contact-input" value={depart} onChange={(e) => setDepart(e.target.value)} required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="contact-label">Arrivée</label>
          <input className="contact-input" value={arrivee} onChange={(e) => setArrivee(e.target.value)} required />
        </div>
      </div>
      <div className="mb-3">
        <label className="contact-label">Prix (MAD)</label>
        <input type="number" step="0.5" className="contact-input" value={prix} onChange={(e) => setPrix(e.target.value)} required />
      </div>

      <div className="mb-4">
        <label className="contact-label">Arrêts Aller</label>
        {arretsAller.map((stop, i) => (
          <div key={i} className="d-flex gap-2 mb-2">
            <input className="contact-input" value={stop} onChange={(e) => handleUpdateStop("aller", i, e.target.value)} />
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveStop("aller", i)} disabled={arretsAller.length === 1}><TrashFill /></button>
          </div>
        ))}
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleAddStop("aller")}><PlusLg /> Ajouter</button>
      </div>

      <div className="mb-4">
        <label className="contact-label">Arrêts Retour</label>
        {arretsRetour.map((stop, i) => (
          <div key={i} className="d-flex gap-2 mb-2">
            <input className="contact-input" value={stop} onChange={(e) => handleUpdateStop("retour", i, e.target.value)} />
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveStop("retour", i)} disabled={arretsRetour.length === 1}><TrashFill /></button>
          </div>
        ))}
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleAddStop("retour")}><PlusLg /> Ajouter</button>
      </div>

      <div className="mb-3">
        <label className="contact-label">Description</label>
        <textarea className="contact-input" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>

      <button type="submit" className="btn-ctf-primary w-100 py-2 mt-3" disabled={status === "loading"}>
        {isEditMode ? "Enregistrer les modifications" : "Ajouter la ligne"}
      </button>
    </form>
  );
}
