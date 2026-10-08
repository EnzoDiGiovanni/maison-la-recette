<?php

namespace Database\Seeders;

use App\Enums\ExperienceType;
use App\Enums\InquiryStatus;
use App\Enums\InquiryType;
use App\Models\Inquiry;
use App\Models\User;
use Illuminate\Database\Seeder;

class InquirySeeder extends Seeder
{
    public function run(): void
    {
        if (Inquiry::query()->exists()) {
            return;
        }

        $inquiries = [
            [
                'type' => InquiryType::ExperienceQuote,
                'name' => 'Laure Bertin',
                'email' => 'laure.bertin@example.com',
                'phone' => '04 72 00 00 01',
                'company' => 'Mutuelle des Deux Fleuves',
                'experience_type' => ExperienceType::FoodTour,
                'participants' => 18,
                'desired_date' => now()->addWeeks(7)->toDateString(),
                'venue' => 'Un quartier proche de nos bureaux, Lyon 3',
                'message' => 'Bonjour, nous cherchons une sortie d\'équipe pour notre service RSE. Le good tour nous plaît beaucoup : est-il possible de l\'organiser près de nos locaux, un jeudi après-midi ?',
                'status' => InquiryStatus::New,
                'days_ago' => 0,
            ],
            [
                'type' => InquiryType::ExperienceQuote,
                'name' => 'Thomas Reynaud',
                'email' => 'thomas.reynaud@example.com',
                'phone' => '06 00 00 00 02',
                'company' => 'Agence Canopée',
                'experience_type' => ExperienceType::Atelier,
                'participants' => 12,
                'desired_date' => now()->addWeeks(4)->toDateString(),
                'venue' => 'Dans nos locaux, Villeurbanne',
                'message' => 'Nous aimerions proposer un atelier anti-gaspi à notre équipe lors d\'un afterwork. Avons-nous besoin d\'une cuisine équipée sur place ?',
                'status' => InquiryStatus::Contacted,
                'internal_notes' => 'Rappelé le lendemain. Pas de cuisine sur place : proposer l\'atelier chez un partenaire. Devis à envoyer.',
                'days_ago' => 3,
            ],
            [
                'type' => InquiryType::ExperienceQuote,
                'name' => 'Aurélie Morel',
                'email' => 'aurelie.morel@example.com',
                'phone' => null,
                'company' => 'Communauté de communes du Val d\'Azergues',
                'experience_type' => ExperienceType::Immersion,
                'participants' => 25,
                'desired_date' => now()->addWeeks(12)->toDateString(),
                'venue' => 'Chez un producteur partenaire',
                'message' => 'Dans le cadre de notre séminaire annuel, nous souhaitons organiser une journée d\'immersion à la ferme pour nos agents.',
                'status' => InquiryStatus::Quoted,
                'internal_notes' => 'Devis envoyé pour 25 personnes, transport non inclus.',
                'days_ago' => 9,
            ],
            [
                'type' => InquiryType::ExperienceQuote,
                'name' => 'Bruno Lacroix',
                'email' => 'bruno.lacroix@example.com',
                'phone' => '06 00 00 00 04',
                'company' => 'Atelier d\'architecture Lacroix',
                'experience_type' => ExperienceType::FoodTour,
                'participants' => 10,
                'desired_date' => now()->subWeeks(3)->toDateString(),
                'venue' => 'La Croix-Rousse',
                'message' => 'Nous sommes une équipe de 10 et souhaitons découvrir le good tour de la Croix-Rousse.',
                'status' => InquiryStatus::Won,
                'internal_notes' => 'Good tour réalisé. Demander un avis.',
                'days_ago' => 40,
            ],
            [
                'type' => InquiryType::PodcastQuote,
                'name' => 'Camille Renard',
                'email' => 'camille.renard@example.com',
                'phone' => '06 00 00 00 05',
                'company' => 'Coopérative Les Champs Communs',
                'message' => 'Nous sommes une coopérative de producteurs bio et aimerions sponsoriser un épisode en lien avec votre ligne éditoriale. Quels formats proposez-vous ?',
                'status' => InquiryStatus::New,
                'days_ago' => 1,
            ],
            [
                'type' => InquiryType::PodcastQuote,
                'name' => 'Vincent Aubert',
                'email' => 'vincent.aubert@example.com',
                'phone' => null,
                'company' => 'Salon du Goût Durable',
                'message' => 'Nous organisons un salon autour de l\'alimentation durable et cherchons quelqu\'un pour animer et enregistrer une table ronde en public.',
                'status' => InquiryStatus::Lost,
                'internal_notes' => 'Date incompatible.',
                'days_ago' => 25,
            ],
            [
                'type' => InquiryType::Contact,
                'name' => 'Martine Dubois',
                'email' => 'martine.dubois@example.com',
                'phone' => null,
                'company' => null,
                'message' => 'Bonjour, fidèle auditrice du podcast, j\'aimerais offrir un atelier lactofermentation à ma sœur. Proposez-vous des bons cadeaux ?',
                'status' => InquiryStatus::Closed,
                'internal_notes' => 'Répondu par e-mail.',
                'days_ago' => 6,
            ],
            [
                'type' => InquiryType::ExperienceQuote,
                'name' => 'Sophie Mercier',
                'email' => 'sophie.mercier@example.com',
                'phone' => '04 78 00 00 08',
                'company' => 'Cabinet Rhône Conseil',
                'experience_type' => ExperienceType::Atelier,
                'participants' => 15,
                'desired_date' => now()->addWeeks(5)->toDateString(),
                'venue' => 'Dans nos locaux, Lyon 2',
                'message' => 'Nous préparons notre semaine de la qualité de vie au travail et aimerions proposer un atelier lactofermentation à nos collaborateurs sur la pause déjeuner. Est-ce possible pour 15 personnes ?',
                'status' => InquiryStatus::New,
                'days_ago' => 2,
            ],
            [
                'type' => InquiryType::ExperienceQuote,
                'name' => 'Karim Benali',
                'email' => 'karim.benali@example.com',
                'phone' => '06 00 00 00 09',
                'company' => 'Métropole Habitat',
                'experience_type' => ExperienceType::FoodTour,
                'participants' => 20,
                'desired_date' => now()->subWeeks(5)->toDateString(),
                'venue' => 'Jean-Macé',
                'message' => 'Pour notre séminaire d\'équipe, nous cherchons une activité conviviale et engagée d\'une demi-journée. Le good tour de Jean-Macé peut-il accueillir 20 personnes, en deux groupes ?',
                'status' => InquiryStatus::Won,
                'internal_notes' => 'Deux groupes de 10 à une heure d\'intervalle. Réalisé, très bons retours.',
                'days_ago' => 55,
            ],
            [
                'type' => InquiryType::PodcastQuote,
                'name' => 'Élodie Charpentier',
                'email' => 'elodie.charpentier@example.com',
                'phone' => '04 26 00 00 10',
                'company' => 'Parc naturel régional du Pilat',
                'message' => 'Nous souhaitons produire une série de podcasts donnant la parole aux producteurs de notre territoire. Pouvez-vous nous accompagner de la conception à la diffusion ?',
                'status' => InquiryStatus::Quoted,
                'internal_notes' => 'Rendez-vous téléphonique fait. Proposition envoyée : série de 4 épisodes.',
                'days_ago' => 12,
            ],
            [
                'type' => InquiryType::Contact,
                'name' => 'Jeanne Rolland',
                'email' => 'jeanne.rolland@example.com',
                'phone' => null,
                'company' => null,
                'message' => 'Bonjour, je suis maraîchère près de Lyon et j\'écoute La recette depuis le début. Je serais ravie d\'accueillir une immersion sur ma ferme : comment vous proposer un partenariat ?',
                'status' => InquiryStatus::Contacted,
                'internal_notes' => 'Très intéressant pour les immersions. Visite de la ferme à caler.',
                'days_ago' => 4,
            ],
        ];

        // Laure's requests belong to the demo company account.
        $customer = User::query()->where('email', 'entreprise@example.com')->first();

        foreach ($inquiries as $data) {
            $receivedAt = now()->subDays($data['days_ago']);
            unset($data['days_ago']);

            $inquiry = new Inquiry($data);
            $inquiry->user_id = $data['name'] === $customer?->name ? $customer->id : null;
            $inquiry->setCreatedAt($receivedAt);
            $inquiry->save();
        }
    }
}
