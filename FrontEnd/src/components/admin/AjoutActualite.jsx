import React, { useState, useEffect } from "react";
import { ImageFill, CheckCircleFill, ExclamationTriangleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

/**
 * Composant AjoutActualite
 * Gère le formulaire des actualités de manière autonome (données, upload, messages de statut).
 */
export default function AjoutActualite({ token, isEditMode, editId, editData }) {
  const navigate = useNavigate();

  // --- ÉTATS ---
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("idle");

  // --- PRÉ-REMPLISSAGE ---
  useEffect(() => {
    if (isEditMode && editData) {
      setTitre(editData.titre || "");
      setContenu(editData.contenu || "");
      if (editData.image) {
        setImagePreview(editData.image.startsWith("http") ? editData.image : `http://127.0.0.1:8000${editData.image}`);
      }
    }
  }, [isEditMode, editData]);

  // --- ACTIONS ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const endpoint = isEditMode ? `/actualites/${editId}` : "/actualites";
      const fd = new FormData();
      fd.append("titre", titre);
      fd.append("contenu", contenu);
      if (imageFile) fd.append("image", imageFile);
      if (isEditMode) fd.append("_method", "PUT");

      const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
        method: "POST", // On utilise POST car FormData ne passe pas bien en PUT natif avec certains serveurs
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: fd,
      });

      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  // --- AFFICHAGE SELON STATUT ---

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <CheckCircleFill size={56} className="text-success mb-3" />
        <h3>Actualité publiée avec succès !</h3>
        <button className="btn-ctf-primary mt-4" onClick={() => navigate("/Admin")}>Terminer</button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-4">
        <ExclamationTriangleFill size={52} className="text-danger mb-3" />
        <h3>Oups ! Une erreur est survenue.</h3>
        <button className="btn-ctf-primary mt-4" onClick={() => setStatus("idle")}>Réessayer</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === "loading" && <div className="overlay-spinner"><div className="contact-spinner" /></div>}
      <div className="mb-3">
        <label className="contact-label">Titre de l'actualité</label>
        <input className="contact-input" value={titre} onChange={(e) => setTitre(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="contact-label">Contenu</label>
        <textarea className="contact-input" rows="6" value={contenu} onChange={(e) => setContenu(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="contact-label"><ImageFill className="me-1" /> Image (Optionnelle)</label>
        <input type="file" className="contact-input" accept="image/*" onChange={handleImageChange} />
      </div>
      {imagePreview && (
        <img src={imagePreview} alt="Aperçu" className="rounded-3 w-100 mb-3 shadow-sm" style={{ maxHeight: 250, objectFit: "cover" }} />
      )}
      <button type="submit" className="btn-ctf-primary w-100 py-2 mt-2" disabled={status === "loading"}>
        {isEditMode ? "Mettre à jour" : "Publier l'actualité"}
      </button>
    </form>
  );
}
