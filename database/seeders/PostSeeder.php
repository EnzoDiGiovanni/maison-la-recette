<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Demo articles written in the client's tone; the last one stays a draft.
     */
    public function run(): void
    {
        $posts = [
            [
                'slug' => '5-episodes-a-deguster',
                'title' => '5 épisodes à déguster pour changer de regard sur son assiette',
                'excerpt' => 'Boulangerie végétale, pêche durable, cuisine économe en énergie… Notre sélection pour se mettre en appétit.',
                'body' => '<p>Un quart de notre empreinte carbone est lié à notre alimentation. La bonne nouvelle, c\'est que nous avons toutes et tous le pouvoir d\'agir avec notre fourchette.</p><h2>Par où commencer ?</h2><p>Chaque épisode de <em>La recette</em> s\'ouvre sur un reportage immersif, puis donne la parole à celles et ceux qui cultivent, fabriquent et cuisinent autrement. Voici cinq rencontres à savourer sans modération.</p><ul><li>La boulangerie végétale</li><li>La pêche durable</li><li>L\'école comestible</li><li>Les jardins de la mer</li><li>L\'énergie, ça se cuisine !</li></ul><p>Bonne écoute, et bon appétit !</p>',
                'published_at' => now()->subWeeks(6),
                'meta_title' => '5 épisodes du podcast La recette à écouter',
                'meta_description' => 'Une sélection de cinq épisodes du podcast La recette pour explorer l\'alimentation de demain.',
            ],
            [
                'slug' => 'team-building-good-tour',
                'title' => 'Team building : et si vous sortiez de la salle de réunion ?',
                'excerpt' => 'Un good tour, c\'est trois heures de balade gustative pour fédérer une équipe autour d\'une alimentation plus durable.',
                'body' => '<p>Un séminaire réussi ne se joue pas toujours autour d\'une table de réunion. Parfois, il se joue autour d\'une table tout court.</p><h2>Rencontrer, découvrir, partager</h2><p>Nos balades gustatives emmènent les équipes à la rencontre de chef·fes et d\'artisan·es engagé·es, en quatre étapes gourmandes. On y découvre des parcours, des savoir-faire et des solutions concrètes.</p><h2>Clés en main ou sur mesure</h2><p>Date, nombre de participant·es, quartier proche de vos locaux : chaque expérience s\'adapte à votre événement, du déjeuner à la journée complète.</p><p>Envie d\'en parler ? Demandez un devis, nous vous répondons sous 48 h.</p>',
                'published_at' => now()->subWeeks(2),
                'meta_title' => 'Team building culinaire à Lyon : le good tour',
                'meta_description' => 'Une balade gustative de 3 h à Lyon pour fédérer votre équipe autour de l\'alimentation durable.',
            ],
            [
                'slug' => 'lactofermentation-par-ou-commencer',
                'title' => 'Lactofermentation : par où commencer ?',
                'excerpt' => 'Des légumes, du sel, un bocal et un peu de patience : la recette d\'une conservation qui a du goût.',
                'body' => '<p>Rien ne se perd, tout se transforme : la lactofermentation est l\'une des façons les plus simples de conserver des légumes de saison, sans cuisson.</p><h2>Le matériel</h2><p>Un bocal propre, des légumes bio et de saison, du sel. C\'est tout.</p><h2>Envie de mettre la main à la pâte ?</h2><p>Lors de nos ateliers, une cheffe vous guide pas à pas : vous découpez, préparez, composez vos bocaux, et repartez avec vos créations et vos recettes.</p>',
                'published_at' => null,
                'meta_title' => null,
                'meta_description' => null,
            ],
        ];

        foreach ($posts as $post) {
            Post::query()->firstOrCreate(['slug' => $post['slug']], $post);
        }
    }
}
