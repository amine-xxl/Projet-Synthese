import React, { useState, useEffect } from "react";
import { TrashFill, PlusLg, CheckCircleFill, ExclamationTriangleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function AjoutLigne({ token, isEditMode, editId, editData }) {
  const navigate = useNavigate();

  // --- ÉTATS DU FORMULAIRE ---
  // Champs de base de la ligne
  const [numero, setNumero] = useState("");
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [prix, setPrix] = useState(5.00);
  const [description, setDescription] = useState("");
  const [arretsAller, setArretsAller] = useState([""]);
  const [arretsRetour, setArretsRetour] = useState([""]);

  // État local pour gérer l'affichage du succès/erreur/chargement
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  // idle = formulaire prêt à être rempli
  // loading = en cours d'envoi
  // success = succès de l'opération
  // error = erreur lors de l'opération

  // --- PRÉ-REMPLISSAGE ---
  useEffect(() => {
    if (isEditMode && editData) {
      setNumero(editData.numero || "");
      setDepart(editData.depart || "");
      setArrivee(editData.arrivee || "");
      setPrix(editData.prix || 5.00);
      setDescription(editData.description || "");
      if (editData.itineraires) { // on vérifie que les itinéraires existent avant de tenter de les utiliser pour éviter les erreurs
        const aller = editData.itineraires.filter(i => i.direction === "aller").map(i => i.nom_arret); // on extrait les arrêts aller et retour à partir des itinéraires de la ligne
        const retour = editData.itineraires.filter(i => i.direction === "retour").map(i => i.nom_arret);
        setArretsAller(aller.length > 0 ? aller : [""]);
        // si aucun arrêt n'est trouvé pour une direction, on initialise avec un champ vide pour permettre à l'utilisateur de saisir le premier arrêt
        setArretsRetour(retour.length > 0 ? retour : [""]);
      }
    }
  }, [isEditMode, editData]);

  // --- GESTION DES ARRÊTS ---
  const handleAddStop = (dir) => { // ajoute un champ d'arrêt supplémentaire pour la direction spécifiée
    if (dir === "aller") setArretsAller([...arretsAller, ""]); // on ajoute un champ vide à la fin du tableau des arrêts aller
    else setArretsRetour([...arretsRetour, ""]); // on ajoute un champ vide à la fin du tableau des arrêts retour
  };
  const handleRemoveStop = (dir, index) => { // supprime le champ d'arrêt à l'index spécifié pour la direction donnée
    if (dir === "aller") setArretsAller(arretsAller.filter((_, i) => i !== index)); // on filtre le tableau des arrêts aller pour supprimer l'arrêt à l'index spécifié
    else setArretsRetour(arretsRetour.filter((_, i) => i !== index));// on filtre le tableau des arrêts retour pour supprimer l'arrêt à l'index spécifié
  };
  const handleUpdateStop = (dir, index, val) => { // met à jour la valeur du champ d'arrêt à l'index spécifié pour la direction donnée
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
        body: JSON.stringify({ // on envoie les données de la ligne au format JSON, en s'assurant de filtrer les arrêts vides pour ne pas envoyer des arrêts sans nom
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
