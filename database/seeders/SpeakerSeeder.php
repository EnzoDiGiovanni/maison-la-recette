<?php

namespace Database\Seeders;

use App\Models\Speaker;
use Illuminate\Database\Seeder;

class SpeakerSeeder extends Seeder
{
    /**
     * The guests shown in the client's presentation, with the label she gives
     * them. Bios and photos are left empty rather than invented.
     */
    public function run(): void
    {
        $speakers = [
            'Jean-Marie Pedron' => 'Les Jardins de la Mer',
            'Camille Labro' => 'L\'école comestible',
            'Nadia Sammut' => 'Cheffe étoilée',
            'Rodolphe Landemaine' => 'La boulangerie végétale',
            'Emilie Félix' => 'L\'énergie, ça se cuisine !',
            'Charles Guirriec' => 'La pêche durable',
        ];

        foreach ($speakers as $name => $role) {
            Speaker::query()->firstOrCreate(['name' => $name], ['role' => $role]);
        }
    }
}
