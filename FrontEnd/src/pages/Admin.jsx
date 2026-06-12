import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  PlusCircleFill,
  BusFrontFill,
  Newspaper,
  ExclamationTriangleFill,
  ShieldFill,
  EnvelopeFill,
} from "react-bootstrap-icons";
import "../index.css";

// Import des nouveaux composants de tableaux 
import LigneTable from "../components/admin/LigneTable";
import ActualiteTable from "../components/admin/ActualiteTable";
import AlerteTable from "../components/admin/AlerteTable";
import MessageTable from "../components/admin/MessageTable";

/**
 * Hook personnalisé pour l'animation d'apparition au scroll
 */
function useScrollReveal(threshold = 0.15) { 
// threshold = 0.15 signifie que l'élément est considéré comme visible lorsque 15% de sa hauteur est visible dans la fenêtre
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver( // IntersectionObserver est une API qui permet de détecter quand un élément entre ou sort de la zone visible de l'écran
      ([entry]) => { if (entry.isIntersecting) setVisible(true); }, // callback qui s'exécute à chaque changement de visibilité de l'élément observé
      { threshold }
    );
    if (ref.current) observer.observe(ref.current); // on commence à observer l'élément référencé car il est monté dans le DOM
    return () => observer.disconnect(); // nettoyage : on arrête d'observer lorsque le composant est démonté
  }, [threshold]);
  return [ref, visible]; // retourne la référence à attacher à l'élément et un booléen indiquant si l'élément est visible ou non
}
export default function Admin() {
  const { user, token } = useAuth();
  const navigate = useNavigate(); // Hook de navigation de React Router pour rediriger l'utilisateur vers d'autres pages

  // Gestion de l'affichage progressif
  const [heroRef, heroVisible] = useScrollReveal(0.1);
  const [tableRef, tableVisible] = useScrollReveal(0.1);

  // État de l'onglet actif : "lignes", "actualites", "alertes", "messages"
  const [activeTab, setActiveTab] = useState("lignes");

  // Sécurité : redirection si l'utilisateur n'est pas admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  /**
   * Redirige vers la page d'ajout en passant l'onglet actif pour pré-sélectionner le bon formulaire
   */
  const handleAddRedirect = () => {
    navigate("/ajout-news", { state: { activeTab } });
  };

  return (
    <div className="admin-page">
      {/* SECTION HERO : En-tête dynamique du Dashboard */}
      <section 
        ref={heroRef} 
        className={`contact-hero d-flex align-items-center justify-content-center position-relative scroll-reveal ${heroVisible ? "revealed" : ""}`}
      >
        <div className="contact-hero-overlay" />
        <div className="container position-relative text-center" style={{ zIndex: 1 }}>
          <div className="contact-hero-icon reveal-up"><ShieldFill size={32} /></div>
          <h1 className="contact-hero-title reveal-up" style={{ animationDelay: "0.1s" }}>Dashboard Admin</h1>
          <p className="contact-hero-subtitle reveal-up" style={{ animationDelay: "0.2s" }}>
            Gérez les lignes, actualités et alertes de Issal Fes.
          </p>
          <div className="d-flex align-items-center justify-content-center gap-3 reveal-up" style={{ animationDelay: "0.3s" }}>
            <div className="contact-divider-line" />
            <div className="contact-divider-diamond" />
            <div className="contact-divider-line" />
          </div>
        </div>
      </section>

      {/* SECTION CORPS : Système d'onglets et tableaux correspondants */}
      <section className="contact-body py-5">
        <div className="container py-3">
          <div ref={tableRef} className={`scroll-reveal ${tableVisible ? "revealed" : ""}`}>
            
            {/* NAVIGATION PAR ONGLETS */}
             <div className="admin-tabs reveal-up">
              <button 
                className={`admin-tab-btn ${activeTab === "lignes" ? "admin-tab-btn--active" : ""}`} 
                onClick={() => setActiveTab("lignes")}
              >
                <BusFrontFill size={16} /> <span>Lignes</span>
              </button>
              <button 
                className={`admin-tab-btn ${activeTab === "actualites" ? "admin-tab-btn--active" : ""}`} 
                onClick={() => setActiveTab("actualites")}
              >
                <Newspaper size={16} /> <span>Actualités</span>
              </button>
              <button 
                className={`admin-tab-btn ${activeTab === "alertes" ? "admin-tab-btn--active" : ""}`} 
                onClick={() => setActiveTab("alertes")}
              >
                <ExclamationTriangleFill size={16} /> <span>Alertes</span>
              </button>
              <button 
                className={`admin-tab-btn ${activeTab === "messages" ? "admin-tab-btn--active" : ""}`} 
                onClick={() => setActiveTab("messages")}
              >
                <EnvelopeFill size={16} /> <span>Messages</span>
              </button>
            </div>

            {/* BARRE D'ACTIONS : Bouton d'ajout (masqué pour les messages) */}
            <div className="d-flex justify-content-end mb-3 reveal-up" style={{ animationDelay: "0.1s" }}>
              {activeTab !== "messages" && (
                <button className="btn-ctf-primary" onClick={handleAddRedirect}>
                  <PlusCircleFill /> Ajouter
                </button>
              )}
            </div>

            {/* CONTENU : Affichage dynamique du tableau selon l'onglet actif */}
            <div className="admin-table-wrap reveal-up" style={{ animationDelay: "0.15s" }}>
                {activeTab === "lignes" && <LigneTable token={token} />}
                {activeTab === "actualites" && <ActualiteTable token={token} />}
                {activeTab === "alertes" && <AlerteTable token={token} />}
                {activeTab === "messages" && <MessageTable token={token} />}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
