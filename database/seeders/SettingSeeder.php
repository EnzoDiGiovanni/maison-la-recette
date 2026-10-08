<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'banner_enabled' => '1',
            'banner_link_label' => 'Inscris-toi',
            'banner_text' => 'et lance-toi dans les défis durables de Maison La Recette',
            'podcast_rating' => '4,9/5',
            'podcast_reviews_count' => '70',
            'podcast_listen_rate' => '75 %',
            'podcast_total_listens' => '+ de 50 000',
            'podcast_episodes_count' => '+ 40',
            'link_ausha' => 'https://smartlink.ausha.co/la-recette',
            'link_apple_podcasts' => 'https://podcasts.apple.com/us/podcast/la-recette/id1673916177',
            'link_overcast' => 'https://overcast.fm/login',
            'link_podcast_addict' => 'https://podcastaddict.com/podcast/la-recette/4295072',
            'link_spotify' => 'https://open.spotify.com/show/78p9jKRzpoGWQ2sTCfBOof',
            'link_deezer' => 'https://www.deezer.com/fr/show/5771417',
            'link_amazon_music' => 'https://music.amazon.com/podcasts/2decf450-2bce-406e-8b1b-efe50b0ce969',
            'link_castbox' => 'https://castbox.fm/channel/id5329922',
            'link_castro' => 'https://castro.fm/podcast/1f1598b3-2f74-415b-a1c1-50db9e93ee24',
            'link_pocket_casts' => 'https://pca.st/wj845012',
            'link_instagram' => 'https://www.instagram.com/larecette_maison/',
            'link_linkedin' => 'https://www.linkedin.com/company/la-recette-les-ingredients-du-changement/home/',
            'contact_email' => 'larecette@ecomail.fr',
            'about_text' => <<<'TEXT'
                Journaliste, j'ai travaillé pendant 15 ans en télévision et réalisé de nombreux reportages pour Arte, France TV, M6 et Euronews, principalement sur des sujets en lien avec l'alimentation.

                Depuis 2023, je produis et anime le podcast La recette, qui part chaque mois à la rencontre d'artisan·es, chef·fes et producteur·rices qui façonnent l'alimentation de demain, pour décrypter les enjeux et solutions de nos assiettes.

                Je produis et réalise aussi des podcasts autour de l'alimentation et de la gastronomie pour des organismes et collectivités, et j'enseigne le podcast natif dans des écoles et universités.

                Enfin, je conçois des expériences en partenariat avec des chef·fes, producteur·rices et artisan·es : ateliers de cuisine, food tours, immersions à la ferme.
                TEXT,
        ];

        foreach ($settings as $key => $value) {
            Setting::query()->firstOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
