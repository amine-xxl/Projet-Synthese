import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, PlusCircleFill, PencilFill } from "react-bootstrap-icons";

// Import des composants autonomes (chaque composant gère sa propre logique et ses messages de statut)
import AjoutLigne from "../components/admin/AjoutLigne";
import AjoutActualite from "../components/admin/AjoutActualite";
import AjoutAlerte from "../components/admin/AjoutAlerte";
import AjoutChauffeur from "../components/admin/AjoutChauffeur";

import "../index.css";

/**
 * Hook pour l'animation d'apparition
 */
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/**
 * Page AjoutNews
 * Agit comme une coque (Shell) qui affiche le formulaire approprié selon l'onglet actif.
 * La logique métier est entièrement déportée dans les sous-composants.
 */
export default function AjoutNews() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation(); // pour récupérer les données passées via la navigation (onglet actif, mode édition, etc.)

  const [heroRef, heroVisible] = useScrollReveal();
  const [formRef, formVisible] = useScrollReveal();

  // Extraction des données de navigation
  const activeTab = state?.activeTab || "lignes"; // par défaut, on considère que l'onglet actif est "lignes" si aucune information n'est passée via la navigation
  const isEditMode = state?.editMode || false; // on considère que c'est un mode édition si le flag editMode est présent et vrai dans le state de la navigation
  const editId = state?.editId || null; // l'ID de l'élément à éditer, s'il s'agit d'une modification
  const editData = state?.editData || null; // les données de l'élément à éditer, passées pour pré-remplir le formulaire en mode édition

  // Sécurité admin
  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
  }, [user, navigate]);

  /**
   * Titre dynamique du Hero
   */
  const getHeroTitle = () => {
    if (activeTab === "chauffeurs") return "Affectation Chauffeur";
    const types = { lignes: "Ligne", actualites: "Actualité", alertes: "Alerte" };
    return `${isEditMode ? "Modifier" : "Ajouter"} une ${types[activeTab]}`;
  };

  /**
   * Chemin de retour dynamique
   */
  const handleBack = () => {
    navigate(activeTab === "chauffeurs" ? "/Affectation" : "/Admin"); 
  };

  return (
    <div className="admin-page">
      {/* HEADER HERO */}
      <section ref={heroRef} className={`contact-hero d-flex align-items-center justify-content-center scroll-reveal ${heroVisible ? "revealed" : ""}`}>
        <div className="contact-hero-overlay" />
        <div className="container text-center position-relative" style={{ zIndex: 1 }}>
          <div className="contact-hero-icon reveal-up">
            {isEditMode ? <PencilFill size={32} /> : <PlusCircleFill size={32} />}
          </div>
          <h1 className="contact-hero-title reveal-up">{getHeroTitle()}</h1>
          <div className="d-flex align-items-center justify-content-center gap-3 mt-3 reveal-up">
            <div className="contact-divider-line" /><div className="contact-divider-diamond" /><div className="contact-divider-line" />
          </div>
        </div>
      </section>

      {/* ZONE FORMULAIRE */}
      <section className="contact-body py-5">
        <div className="container py-3">
          <div ref={formRef} className={`scroll-reveal ${formVisible ? "revealed" : ""}`}>
            <button className="btn btn-outline-secondary mb-4" onClick={handleBack}>
              <ArrowLeft className="me-1" /> Retour
            </button>

            <div className="contact-form-card shadow-sm">
              {/* Le composant affiché dépend de l'onglet actif passé via la navigation */}
              {activeTab === "lignes" && (
                <AjoutLigne token={token} isEditMode={isEditMode} editId={editId} editData={editData} />
              )}
              {activeTab === "actualites" && (
                <AjoutActualite token={token} isEditMode={isEditMode} editId={editId} editData={editData} />
              )}
              {activeTab === "alertes" && (
                <AjoutAlerte token={token} isEditMode={isEditMode} editId={editId} editData={editData} />
              )}
              {activeTab === "chauffeurs" && (
                <AjoutChauffeur token={token} isEditMode={isEditMode} editData={editData} />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
