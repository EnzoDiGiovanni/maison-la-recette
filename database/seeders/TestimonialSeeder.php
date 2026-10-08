<?php

namespace Database\Seeders;

use App\Enums\ExperienceType;
use App\Models\Experience;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * The three customer reviews from the client's presentation. The two
     * about the Good tours are attached to one each; the third is general.
     */
    public function run(): void
    {
        $testimonials = [
            [
                'author_name' => 'Bruno',
                'author_role' => 'Responsable RSE',
                'quote' => 'Parce que l\'alimentation nous touche toutes et tous et pour porter un nouveau regard sur notre assiette, le GOOD TOUR est une super idée pour une sortie en équipe. Détente et dégustation au rendez-vous ! Allez-y vite !',
                'experience_type' => ExperienceType::FoodTour,
                'experience' => 'good-tour-croix-rousse',
            ],
            [
                'author_name' => 'Anouck',
                'author_role' => 'Responsable achat',
                'quote' => 'Un super concept pour une sortie en équipe. Un parcours inspirant et de belles rencontres ! On revient enchanté de cette parenthèse culinaire.',
                'experience_type' => ExperienceType::FoodTour,
                'experience' => 'good-tour-jean-mace',
            ],
            [
                'author_name' => 'Marie',
                'author_role' => 'Architecte',
                'quote' => 'Une expérience originale, savoureuse et engagée. On apprend en se régalant, et au contact de passionné·es qui agissent concrètement. Je recommande vivement.',
                'experience_type' => null,
                'experience' => null,
            ],
        ];

        $experienceIds = Experience::query()->pluck('id', 'slug');

        foreach ($testimonials as $index => $testimonial) {
            $slug = $testimonial['experience'];
            unset($testimonial['experience']);

            $record = Testimonial::query()->firstOrCreate(
                ['author_name' => $testimonial['author_name'], 'author_role' => $testimonial['author_role']],
                [...$testimonial, 'is_published' => true, 'sort_order' => $index + 1],
            );

            // Reviews seeded before the link existed get it on the next run.
            if ($record->experience_id === null && $slug !== null) {
                $record->update(['experience_id' => $experienceIds[$slug] ?? null]);
            }
        }
    }
}
