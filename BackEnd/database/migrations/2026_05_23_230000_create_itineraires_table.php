<?php

/*
|--------------------------------------------------------------------------
| Migration : Création de la table "itineraires"
|--------------------------------------------------------------------------
|
| Cette table stocke les arrêts (stops) de chaque ligne de bus.
| Chaque arrêt appartient à une ligne (ligne_id) et a :
|   - une direction : "aller" ou "retour"
|   - un nom d'arrêt : le nom de la station (ex: "Bab Ftouh")
|   - un ordre : la position de l'arrêt dans le trajet (1, 2, 3...)
|
| Relation :  Ligne (1) ──── (N) Itineraire
|             Une ligne peut avoir plusieurs arrêts.
|
| Exemple :
|   Ligne L01 (Bab Ftouh → Ain Chkef)
|     → Itineraire { ligne_id: 1, direction: "aller", nom_arret: "Place Atlas", ordre: 1 }
|     → Itineraire { ligne_id: 1, direction: "aller", nom_arret: "Hay Saada",   ordre: 2 }
|     → Itineraire { ligne_id: 1, direction: "retour", nom_arret: "Ain Chkef",  ordre: 1 }
|
*/

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Créer la table "itineraires".
     */
    public function up(): void
    {
        Schema::create('itineraires', function (Blueprint $table) {

            $table->id();
            $table->foreignId('ligne_id')->constrained('lignes')->onDelete('cascade');
            $table->enum('direction', ['aller', 'retour']);
            $table->string('nom_arret');
            $table->integer('ordre');
            $table->timestamps();
        });
    }

    /**
     * Supprimer la table "itineraires" si on annule la migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('itineraires');
    }
};
