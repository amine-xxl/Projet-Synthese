<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Déconnexion</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }

        .email-header {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
            border-bottom: 2px solid #6c757d;
        }

        .email-header img {
            max-width: 150px;
            height: auto;
        }

        .email-profile {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 20px;
            background-color: #f0f0f0;
            border-bottom: 1px solid #ddd;
        }

        .email-profile img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
        }

        .email-content {
            padding: 30px;
        }

        .email-content h2 {
            color: #6c757d;
            margin-top: 0;
        }

        .email-footer {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header with Logo -->
        <div class="email-header">
            <img src="{{ asset('storage/logo.png') }}" alt="Issal Fes Logo">
        </div>

        <!-- Profile Section -->
        <div class="email-profile">
            <img src="{{ asset('storage/logo.png') }}" alt="Profile">
            <div>
                <strong style="color: #6c757d; font-size: 16px;">Issal Fes</strong>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">Notification Compte</p>
            </div>
        </div>

        <!-- Main Content -->
        <div class="email-content">
            <h2>Au revoir {{ $user->name }}</h2>

            <p>
                Vous êtes maintenant déconnecté de votre compte Issal Fes.
            </p>

            <p>
                Merci pour votre visite. Nous espérons vous revoir bientôt!
            </p>

            <p>
                Merci,<br>
                <strong>L'équipe Issal Fes</strong>
            </p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>&copy; 2026 Issal Fes. Tous droits réservés.</p>
        </div>
    </div>
</body>

</html>
