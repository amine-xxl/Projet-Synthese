import React, { useState, useEffect } from "react";
import { ImageFill, CheckCircleFill, ExclamationTriangleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function AjoutActualite({ token, isEditMode, editId, editData }) {
  const navigate = useNavigate();

  // --- ÉTATS DU FORMULAIRE ---
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [imageFile, setImageFile] = useState(null);       // Fichier image brut (pour l'envoi)
  const [imagePreview, setImagePreview] = useState("");   // URL pour l'aperçu visuel
  
  // État de la soumission (idle | loading | success | error)
  const [status, setStatus] = useState("idle");

  // --- PRÉ-REMPLISSAGE (MODE ÉDITION) ---
  useEffect(() => {
    if (isEditMode && editData) {
      setTitre(editData.titre || "");
      setContenu(editData.contenu || "");
      
      // Gestion de l'aperçu de l'image existante sur le serveur
      if (editData.image) {
        setImagePreview(
          editData.image.startsWith("http") 
            ? editData.image 
            : `http://127.0.0.1:8000${editData.image}`
        );
      }
    }
  }, [isEditMode, editData]);

  // --- ACTIONS (GESTION IMAGE & SOUMISSION) ---

  /**
   * Gère le changement de fichier image et crée un aperçu temporaire.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Création d'une URL Blob pour l'affichage local
    }
  };

  /**
   * Envoie les données du formulaire au serveur via FormData.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const endpoint = isEditMode ? `/actualites/${editId}` : "/actualites";
      
      // Utilisation de FormData pour gérer l'upload de fichier
      const fd = new FormData();
      fd.append("titre", titre);
      fd.append("contenu", contenu);
      
      // On n'ajoute l'image que si un nouveau fichier a été sélectionné
      if (imageFile) fd.append("image", imageFile);
      
      // Simuler une méthode PUT pour Laravel via FormData (qui ne supporte nativement que POST)
      if (isEditMode) fd.append("_method", "PUT");

      const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
        method: "POST", // Toujours POST pour le FormData
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: fd,
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("Erreur serveur lors de la publication :", errData);
        setStatus("error");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setStatus("error");
    }
  };

  // --- RENDU CONDITIONNEL (SUCCÈS / ERREUR) ---

  // Écran de succès
  if (status === "success") {
    return (
      <div className="text-center py-4">
        <CheckCircleFill size={56} className="text-success mb-3" />
        <h3 className="fw-bold">Actualité publiée !</h3>
        <p className="text-secondary">L'article a été mis à jour dans le réseau Issal Fes.</p>
        <button 
          className="btn-ctf-primary mt-4 px-5" 
          onClick={() => navigate("/Admin")}
          style={{ borderRadius: "12px" }}
        >
          Retour au Dashboard
        </button>
      </div>
    );
  }

  // Écran d'erreur
  if (status === "error") {
    return (
      <div className="text-center py-4">
        <ExclamationTriangleFill size={52} className="text-danger mb-3" />
        <h3 className="fw-bold">Échec de l'enregistrement</h3>
        <p className="text-secondary">Une erreur est survenue lors de la communication avec le serveur.</p>
        <button className="btn-ctf-primary mt-4 px-4" onClick={() => setStatus("idle")}>
          Réessayer
        </button>
      </div>
    );
  }

  // --- FORMULAIRE ---
  return (
    <form onSubmit={handleSubmit} className="position-relative">
      {/* Overlay de chargement pendant l'envoi */}
      {status === "loading" && (
        <div className="overlay-spinner">
          <div className="contact-spinner" />
          <p className="mt-2 fw-bold">Publication en cours...</p>
        </div>
      )}

      {/* Titre de l'article */}
      <div className="mb-3">
        <label className="contact-label">Titre de l'actualité</label>
        <input 
          className="contact-input" 
          value={titre} 
          placeholder="Entrez un titre accrocheur..." 
          onChange={(e) => setTitre(e.target.value)} 
          required 
        />
      </div>

      {/* Contenu principal */}
      <div className="mb-3">
        <label className="contact-label">Contenu de l'article</label>
        <textarea 
          className="contact-input" 
          rows="6" 
          value={contenu} 
          placeholder="Rédigez votre article ici..." 
          onChange={(e) => setContenu(e.target.value)} 
          required 
        />
      </div>

      {/* Upload d'image avec aperçu dynamique */}
      <div className="mb-3">
        <label className="contact-label">
          <ImageFill className="me-1" /> Image d'illustration (recommandée)
        </label>
        <input 
          type="file" 
          className="contact-input" 
          accept="image/*" 
          onChange={handleImageChange} 
        />
      </div>

      {/* Affichage de l'aperçu si une image est sélectionnée ou existante */}
      {imagePreview && (
        <div className="mb-4 text-center">
          <p className="contact-label small text-start">Aperçu visuel :</p>
          <img 
            src={imagePreview} 
            alt="Aperçu" 
            className="rounded-3 w-100 shadow-sm border" 
            style={{ maxHeight: 280, objectFit: "cover" }} 
          />
        </div>
      )}

      {/* Bouton de validation final */}
      <button 
        type="submit" 
        className="btn-ctf-primary w-100 py-3 mt-2 shadow-sm" 
        disabled={status === "loading"}
        style={{ borderRadius: "14px", fontSize: "16px" }}
      >
        {isEditMode ? "Mettre à jour l'article" : "Publier maintenant"}
      </button>
    </form>
  );
}
