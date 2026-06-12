import { createContext, useContext, useState } from "react";
import { CheckCircleFill } from "react-bootstrap-icons";

const AuthContext = createContext();

export function AuthProvider({ children }) { // children = tout le reste de l'app qui est englobé par ce provider <App/>
  // composant qui englobe toute l'app et fournit le contexte d'authentification
  const [user, setUser] = useState(() => {
    try { // on essaie de récupérer les infos utilisateur depuis le localStorage au chargement de l'app
      return JSON.parse(localStorage.getItem("user")) || null; //json.parse pour convertir la chaîne JSON en objet JavaScript
    } catch { // si le JSON est mal formé ou absent, on retourne null
      return null;
    }
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [toast, setToast] = useState(null); // state pour gérer les messages de toast

  function showToast(message) {
    setToast(message); // on affiche le message de toast
    setTimeout(() => setToast(null), 4000); // TIMEOUT POUR LA FONCTION 4s
  }

  function login(userData, tokenData) {
    localStorage.setItem("user", JSON.stringify(userData)); // on stocke les données utilisateur dans le localStorage -< convertir l'objet en string
    localStorage.setItem("token", tokenData);
    // on met à jour le state avec les données utilisateur et le token
    setUser(userData);
    setToken(tokenData);
    showToast(`Connexion réussie. Bienvenue ${userData.name} !`);
  }

  function logout() {
    // on appelle l'API pour annuler le token côté serveur
    if (token) {
      fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST", // on utilise POST pour indiquer au serveur de supprimer le token
        headers: { // hearders c'est les métadonnées de la requete metadonnees = des infos supplémentaires qui accompagnent la requete
          Authorization: `Bearer ${token}`, // on envoie le token dans les headers pour que le serveur puisse l'identifier et le supprimer
// bearer c'est schéma d'authentification qui indique que la requete porte un token d'accès
          Accept: "application/json", // on précise qu'on attend une réponse au format JSON du serveur
        },
      }).catch(() => {
        // Silently fail — on nettoie quand même côté client
      });
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    showToast("Déconnexion réussie. À bientôt !");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, showToast }}>
      {/* Le Provider qui partage les données du contexte avec tous les composants */}
      {children}
      {/* children représente tout ce qui est placé entre les balises du composant. <App /> */}
      {toast && (
        <div className="auth-toast">
          <div className="d-flex align-items-center gap-3">
            <CheckCircleFill className="auth-toast-icon" size={24} />
            <span className="fw-bold auth-toast-text">{toast}</span>
          </div>
          <div className="auth-toast-progress" />
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() { // Hook personnalisé pour accéder facilement au contexte d'authentification dans les composants
  return useContext(AuthContext);// useContext pour consommer le contexte et accéder aux données d'authentification
}
