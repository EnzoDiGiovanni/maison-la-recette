<?php

namespace Database\Seeders;

use App\Enums\ExperienceType;
use App\Models\Experience;
use Illuminate\Database\Seeder;

class ExperienceSeeder extends Seeder
{
    public function run(): void
    {
        $experiences = [
            [
                'slug' => 'atelier-lactofermentation',
                'type' => ExperienceType::Atelier,
                'title' => 'Lactofermentation',
                'tagline' => 'Mettez de la vie dans vos bocaux.',
                'description' => 'Vivez un atelier collectif aux côtés d\'une cheffe passionnée. Découvrez, cuisinez et apprenez ensemble, puis repartez avec des conseils et des recettes.',
                'highlights' => [
                    'Découvrez avec une cheffe passionnée les bienfaits, techniques et saveurs de la lactofermentation.',
                    'Découpez, préparez et transformez vos légumes bio et de saison en condiments acidulés et composez vos bocaux.',
                    'Goûtez de nouvelles saveurs et repartez avec vos créations et recettes.',
                ],
                'duration_label' => '2 h',
                'price_from_cents' => 7000,
                'location' => 'Dans vos locaux ou chez nos partenaires à Lyon',
            ],
            [
                'slug' => 'atelier-anti-gaspi',
                'type' => ExperienceType::Atelier,
                'title' => 'Anti-gaspi',
                'tagline' => 'Rien ne se perd, tout se transforme !',
                'description' => 'Partagez la passion d\'un chef engagé pour les bons produits et apprenez à les utiliser de A à Z, dans un atelier qui favorise la cohésion d\'équipe.',
                'highlights' => [
                    'Partagez la passion d\'un chef engagé pour les bons produits et apprenez à les utiliser de A à Z.',
                    'Sublimez des ingrédients abîmés et transformez-les en recettes délicieuses.',
                    'Savourez ensemble le fruit de votre travail autour d\'une dégustation.',
                ],
                'duration_label' => '2 h',
                'price_from_cents' => 7000,
                'location' => 'Dans vos locaux ou chez nos partenaires à Lyon',
            ],
            [
                'slug' => 'good-tour-croix-rousse',
                'type' => ExperienceType::FoodTour,
                'title' => 'La Croix-Rousse',
                'tagline' => 'La colline qui travaille… et qui régale.',
                'description' => 'Une balade gustative et inspirante en 4 étapes gourmandes au cœur du quartier emblématique de la Croix-Rousse où, depuis des siècles, on innove et réinvente la gastronomie lyonnaise.',
                'highlights' => [
                    '4 étapes gourmandes au cœur de la Croix-Rousse.',
                    'Rencontrez les chef·fes et artisan·es engagé·es de la colline.',
                    'Goûtez leur savoir-faire : visites, ateliers, dégustations.',
                ],
                'duration_label' => '3 h',
                'price_from_cents' => 6000,
                'location' => 'La Croix-Rousse, Lyon 4',
            ],
            [
                'slug' => 'good-tour-jean-mace',
                'type' => ExperienceType::FoodTour,
                'title' => 'Jean-Macé',
                'tagline' => 'Les coulisses de nos assiettes, côté Lyon 7.',
                'description' => 'Explorez les coulisses de nos assiettes dans le quartier de Jean-Macé et échangez avec des passionné·es de l\'alimentation durable.',
                'highlights' => [
                    'Un parcours en 4 escales gourmandes.',
                    'Échangez avec des passionné·es de l\'alimentation durable.',
                    'Découvrez leur parcours, leur cuisine et leur démarche.',
                ],
                'duration_label' => '3 h',
                'price_from_cents' => 6000,
                'location' => 'Jean-Macé, Lyon 7',
            ],
            [
                'slug' => 'immersion-a-la-ferme',
                'type' => ExperienceType::Immersion,
                'title' => 'Immersion à la ferme',
                'tagline' => 'Une journée les mains dans la terre.',
                'description' => 'Partagez le quotidien et le savoir-faire de producteur·trices locaux. Tissez des liens et créez des souvenirs marquants, au rythme des saisons.',
                'highlights' => [
                    'Semez, plantez, récoltez, fabriquez, au rythme des saisons.',
                    'Partagez le quotidien et le savoir-faire de producteur·trices locaux.',
                    'Une expérience sur mesure pour vos séminaires et teambuildings.',
                ],
                'duration_label' => 'Une journée',
                'price_from_cents' => null,
                'location' => 'Chez nos producteur·trices partenaires',
            ],
        ];

        foreach ($experiences as $index => $experience) {
            Experience::query()->firstOrCreate(
                ['slug' => $experience['slug']],
                [...$experience, 'is_published' => true, 'sort_order' => $index + 1],
            );
        }
    }
}
