<?php

namespace App\Filament\Widgets;

use App\Enums\BookingStatus;
use App\Enums\InquiryStatus;
use App\Filament\Resources\Bookings\BookingResource;
use App\Filament\Resources\ExperienceSessions\ExperienceSessionResource;
use App\Filament\Resources\Inquiries\InquiryResource;
use App\Models\Booking;
use App\Models\ExperienceSession;
use App\Models\Inquiry;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Number;

/**
 * What the client needs to see when she opens the back office: requests to
 * answer, sessions coming up and what the last 30 days brought in.
 */
class SiteOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $newInquiries = Inquiry::query()->where('status', InquiryStatus::New)->count();
        $upcomingSessions = ExperienceSession::query()->upcoming()->count();
        $nextSession = ExperienceSession::query()->upcoming()->first();

        $recentBookings = Booking::query()
            ->where('status', BookingStatus::Paid)
            ->where('paid_at', '>=', now()->subDays(30));

        return [
            Stat::make('Nouvelles demandes', $newInquiries)
                ->description($newInquiries > 0 ? 'À traiter' : 'Tout est traité')
                ->color($newInquiries > 0 ? 'danger' : 'success')
                ->url(InquiryResource::getUrl('index')),
            Stat::make('Sessions à venir', $upcomingSessions)
                ->description($nextSession ? 'Prochaine le '.$nextSession->starts_at->format('d/m/Y à H:i') : 'Aucune session ouverte')
                ->url(ExperienceSessionResource::getUrl('index')),
            Stat::make('Réservations payées (30 jours)', (clone $recentBookings)->count())
                ->description(Number::currency(((int) $recentBookings->sum('amount_cents')) / 100, 'EUR', 'fr').' encaissés')
                ->url(BookingResource::getUrl('index')),
        ];
    }
}
