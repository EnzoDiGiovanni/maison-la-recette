<?php

namespace Database\Seeders;

use App\Enums\ExperienceType;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * The three customer reviews from the client's presentation.
     */
    public function run(): void
    {
        $testimonials = [
            [
                'author_name' => 'Bruno',
                'author_role' => 'Responsable RSE',
                'quote' => 'Parce que l\'alimentation nous touche toutes et tous et pour porter un nouveau regard sur notre assiette, le GOOD TOUR est une super idée pour une sortie en équipe. Détente et dégustation au rendez-vous ! Allez-y vite !',
                'experience_type' => ExperienceType::FoodTour,
            ],
            [
                'author_name' => 'Anouck',
                'author_role' => 'Responsable achat',
                'quote' => 'Un super concept pour une sortie en équipe. Un parcours inspirant et de belles rencontres ! On revient enchanté de cette parenthèse culinaire.',
                'experience_type' => ExperienceType::FoodTour,
            ],
            [
                'author_name' => 'Marie',
                'author_role' => 'Architecte',
                'quote' => 'Une expérience originale, savoureuse et engagée. On apprend en se régalant, et au contact de passionné·es qui agissent concrètement. Je recommande vivement.',
                'experience_type' => null,
            ],
        ];

        foreach ($testimonials as $index => $testimonial) {
            Testimonial::query()->firstOrCreate(
                ['author_name' => $testimonial['author_name'], 'author_role' => $testimonial['author_role']],
                [...$testimonial, 'is_published' => true, 'sort_order' => $index + 1],
            );
        }
    }
}
