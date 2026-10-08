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
            [
                'slug' => 'anti-gaspi-rien-ne-se-perd',
                'title' => 'Anti-gaspi : rien ne se perd, tout se transforme',
                'excerpt' => 'Fanes, épluchures, pain de la veille : et si les restes devenaient les meilleurs ingrédients de la semaine ?',
                'body' => '<p>En France, 20 tonnes de nourriture sont jetées chaque minute. Derrière ce chiffre, il y a surtout des produits que l\'on ne sait plus cuisiner jusqu\'au bout.</p><h2>Utiliser les produits de A à Z</h2><p>Un légume ne s\'arrête pas à sa partie la plus noble. Les fanes, les tiges et les épluchures ont du goût, à condition de savoir quoi en faire.</p><ul><li>Les fanes se transforment en pesto ou en soupe.</li><li>Les épluchures bio deviennent des chips au four.</li><li>Le pain rassis se change en chapelure ou en pain perdu.</li></ul><h2>Sublimer plutôt que jeter</h2><p>Un fruit abîmé n\'est pas un fruit perdu : compotes, chutneys et gâteaux lui offrent une seconde vie.</p><blockquote><p>Rien ne se perd, tout se transforme !</p></blockquote><h3>En atelier, avec un chef engagé</h3><p>Pendant deux heures, on apprend à cuisiner les ingrédients en entier, puis on déguste ensemble ce que l\'on a préparé.</p>',
                'published_at' => now()->subWeek(),
                'meta_title' => 'Cuisine anti-gaspi : nos conseils pour ne rien jeter',
                'meta_description' => 'Fanes, épluchures, pain rassis : des idées simples pour cuisiner les produits de A à Z et réduire le gaspillage alimentaire.',
            ],
            [
                'slug' => 'croix-rousse-ou-jean-mace',
                'title' => 'Croix-Rousse ou Jean-Macé : deux balades gustatives à Lyon',
                'excerpt' => 'Deux quartiers, quatre étapes gourmandes chacun, et la même envie : rencontrer celles et ceux qui font l\'alimentation de demain.',
                'body' => '<p>Un good tour, c\'est une balade de trois heures ponctuée de visites, d\'ateliers et de dégustations. À Lyon, deux parcours vous attendent.</p><h2>La Croix-Rousse, Lyon 4</h2><p>Sur la colline, on réinvente la gastronomie lyonnaise depuis des siècles. Le parcours relie quatre étapes gourmandes, à la rencontre des chef·fes et artisan·es engagé·es du quartier.</p><h2>Jean-Macé, Lyon 7</h2><p>Quatre escales gourmandes pour échanger avec des passionné·es de l\'alimentation durable : leur parcours, leur cuisine, leur démarche.</p><h2>Comment choisir ?</h2><ol><li>Regardez les dates ouvertes à la réservation.</li><li>Choisissez le quartier qui vous fait envie, ou le plus proche de vos locaux.</li><li>Venez avec votre curiosité, on s\'occupe du reste.</li></ol><p>Pour une équipe, le parcours s\'organise aussi sur mesure, à la date de votre choix.</p>',
                'published_at' => now()->subWeeks(3),
                'meta_title' => 'Food tour à Lyon : Croix-Rousse et Jean-Macé',
                'meta_description' => 'Deux balades gustatives de 3 h à Lyon, à la rencontre de chef·fes et d\'artisan·es engagé·es.',
            ],
            [
                'slug' => 'un-podcast-qui-commence-sur-le-terrain',
                'title' => 'Pourquoi nos épisodes commencent toujours sur le terrain',
                'excerpt' => 'Avant la conversation, il y a le reportage : les bruits d\'un fournil, d\'un potager ou d\'un port de pêche.',
                'body' => '<p>Chaque épisode de <em>La recette</em> est enregistré en présentiel et s\'ouvre sur un reportage immersif. Ce n\'est pas un détail de fabrication : c\'est ce qui donne envie d\'écouter la suite.</p><h2>Entendre avant de comprendre</h2><p>Un pétrin qui tourne, une cuisine en plein service, une récolte au petit matin : le son plante le décor mieux qu\'une longue introduction.</p><blockquote><p>Et si on changeait le monde en mangeant ?</p></blockquote><h2>Des rencontres, pas des interviews</h2><p>Se déplacer, c\'est prendre le temps. Les invité·es parlent de leur métier là où ils et elles l\'exercent, et cela s\'entend.</p><p>Plus de 40 épisodes sont à écouter sur le site et sur toutes les plateformes.</p>',
                'published_at' => now()->subWeeks(4),
                'meta_title' => 'La recette : un podcast enregistré sur le terrain',
                'meta_description' => 'Pourquoi chaque épisode du podcast La recette s\'ouvre sur un reportage immersif.',
            ],
            [
                'slug' => 'trois-chiffres-sur-notre-assiette',
                'title' => 'Trois chiffres pour comprendre le poids de notre assiette',
                'excerpt' => 'Climat, gaspillage, santé : ce que nous mangeons compte plus qu\'on ne le croit. La bonne nouvelle, c\'est que l\'on peut agir.',
                'body' => '<p>L\'alimentation est un sujet sérieux, mais ce n\'est pas une raison pour perdre l\'appétit. Voici trois repères à garder en tête.</p><ol><li><strong>Un quart</strong> de notre empreinte carbone est lié à notre alimentation.</li><li><strong>20 tonnes</strong> de nourriture sont jetées chaque minute en France.</li><li><strong>1 Français sur 3</strong> souffre d\'une maladie chronique directement liée à son alimentation.</li></ol><h2>Le pouvoir d\'agir avec sa fourchette</h2><p>Nourrir, transmettre, créer des liens, préserver sa santé, protéger la planète : nos repas nous donnent chaque jour l\'occasion de faire autrement.</p><h2>Par où commencer ?</h2><p>En écoutant celles et ceux qui cultivent, fabriquent et cuisinent de façon durable, puis en mettant la main à la pâte.</p>',
                'published_at' => now()->subWeeks(8),
                'meta_title' => 'Alimentation durable : trois chiffres à connaître',
                'meta_description' => 'Empreinte carbone, gaspillage, santé : trois chiffres pour comprendre l\'impact de notre alimentation.',
            ],
            [
                'slug' => 'une-journee-en-immersion',
                'title' => 'Une journée en immersion, au rythme des saisons',
                'excerpt' => 'Semer, planter, récolter, vinifier, fabriquer : partager le quotidien de producteur·rices locaux, le temps d\'une journée.',
                'body' => '<p>L\'immersion est le format le plus long de nos expériences. On quitte la ville pour passer une journée, parfois plusieurs, aux côtés de producteur·rices locaux.</p><h2>Les mains dans la terre</h2><p>Le programme dépend de la saison : on sème, on plante, on récolte, on vinifie ou on fabrique. On ne regarde pas faire, on participe.</p><h2>Un format pensé pour les équipes</h2><p>Les immersions s\'adressent aujourd\'hui surtout aux entreprises et aux organisations, pour un séminaire ou un team building.</p><ul><li>Une date choisie avec vous.</li><li>Un groupe à taille humaine.</li><li>Des produits bruts, locaux et de saison.</li></ul><p>Chaque immersion se construit sur devis, après un premier échange.</p>',
                'published_at' => now()->subWeeks(10),
                'meta_title' => 'Immersion chez des producteurs : team building durable',
                'meta_description' => 'Une journée en immersion chez des producteur·rices locaux pour fédérer votre équipe.',
            ],
        ];

        foreach ($posts as $post) {
            Post::query()->firstOrCreate(['slug' => $post['slug']], $post);
        }
    }
}
