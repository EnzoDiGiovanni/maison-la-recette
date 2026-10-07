<?php

namespace App\Console\Commands;

use App\Services\Ausha\PodcastSynchronizer;
use Illuminate\Console\Command;
use Throwable;

class SyncPodcasts extends Command
{
    protected $signature = 'podcasts:sync';

    protected $description = 'Import the episodes published on Ausha';

    public function handle(PodcastSynchronizer $synchronizer): int
    {
        try {
            $result = $synchronizer->sync();
        } catch (Throwable $exception) {
            report($exception);

            $this->error($exception->getMessage());

            return self::FAILURE;
        }

        $this->info("{$result['created']} épisode(s) importé(s), {$result['updated']} mis à jour.");

        return self::SUCCESS;
    }
}
