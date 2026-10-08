<?php

namespace Database\Seeders;

use App\Models\Speaker;
use Illuminate\Database\Seeder;

class SpeakerSeeder extends Seeder
{
    /**
     * The guests of the show, with the role given in the title of their
     * episode. Bios and photos are left empty rather than invented. They are
     * created before the episodes, so that the import links each one to its guest.
     */
    public function run(): void
    {
        $speakers = [
            // Saison 3
            'Jean-Marie Pédron' => 'Cueilleur d\'algues, Les Jardins de la Mer',
            'Camille Labro' => 'Fondatrice de l\'École comestible',
            'Nadia Sammut' => 'Cheffe étoilée',
            'Rodolphe Landemaine' => 'Artisan boulanger, fondateur de Land & Monkeys',
            'Emilie Félix' => 'Autrice de « L\'énergie, ça se cuisine »',
            'Charles Guirriec' => 'Fondateur de Poiscaille',
            // Saison 2
            'Vincent Brassart' => 'Fondateur de La Tablée des Chefs France',
            'Pierre-André Aubert' => 'Créateur du premier restaurant solaire',
            'Etienne Culot' => 'Pâtissier',
            'Christophe Eberhart' => 'Cofondateur d\'Ethiquable',
            'Vanessa Krycève' => 'Cofondatrice du RECHO',
            'Clément Méry' => 'Cofondateur de Willy anti-gaspi',
            'Guillaume Gomez' => 'Ambassadeur de la gastronomie française',
            'Caroline Hubert' => 'Pâtissière',
            'Guillaume Gregoris' => 'Cofondateur du restaurant SEMO',
            'Ludivine Royannez' => 'Fondatrice du Café Equilibres',
            'Kelly Frank' => 'Fondatrice de Goûm',
            'Katia Tardy' => 'Fondatrice d\'une biscuiterie engagée',
            'Diane Dupré la Tour' => 'Autrice et cofondatrice des Petites Cantines',
            'Géraldine Dubois' => 'Vigneronne, créatrice du domaine La Têtue',
            'Laure Verdeau' => 'Directrice de l\'Agence BIO',
            'Célia Rennesson' => 'Créatrice du réseau Vrac & Réemploi',
            'Boris Tavernier' => 'Fondateur de l\'association VRAC',
            'Christian Têtedoie' => 'Chef étoilé, Meilleur Ouvrier de France',
            // Saison 1
            'Ariane Delmas' => 'Les Marmites volantes',
            'Emily Dader' => 'Les Mauvaises Herbes',
            'Vincent Galliot' => 'Le Champ des saveurs',
            'Eric Petrotto' => 'La Fabuleuse Cantine',
            'Mayé Lepoutre' => 'Bonomia',
            'Paul Charlent' => 'Alancienne',
            'Gilles Daveau' => 'Cuisines nourricières',
            'Clara Duchalet' => 'Vépluche',
            'Clémence Richeux' => 'Ma Bouteille s\'appelle Reviens',
            'Etienne Rozand' => 'Hape & Lipopette',
        ];

        foreach ($speakers as $name => $role) {
            Speaker::query()->firstOrCreate(['name' => $name], ['role' => $role]);
        }
    }
}
