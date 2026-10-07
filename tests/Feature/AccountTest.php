<?php

use App\Enums\AccountType;
use App\Enums\BookingStatus;
use App\Enums\ExperienceType;
use App\Enums\InquiryType;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\Experience;
use App\Models\ExperienceSession;
use App\Models\Inquiry;
use App\Models\Podcast;
use App\Models\User;
use Filament\Facades\Filament;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

function openSession(int $capacity = 10): ExperienceSession
{
    $experience = Experience::create([
        'type' => ExperienceType::Atelier,
        'title' => 'Lactofermentation',
        'slug' => 'lactofermentation',
        'is_published' => true,
    ]);

    return ExperienceSession::create([
        'experience_id' => $experience->id,
        'starts_at' => now()->addWeek(),
        'capacity' => $capacity,
        'price_cents' => 7000,
    ]);
}

/**
 * @return array<string, string>
 */
function demoCard(): array
{
    return ['card_name' => 'Claire Fontaine', 'card_number' => '4242 4242 4242 4242', 'card_expiry' => '12/'.now()->addYear()->format('y'), 'card_cvc' => '123'];
}

it('sends guests to the login page', function () {
    $this->get('/dashboard')->assertRedirect(route('login'));
    $this->get(route('login'))->assertInertia(fn (Assert $page) => $page->component('auth/login')->where('auth.user', null));
    $this->get(route('register'))->assertInertia(fn (Assert $page) => $page->component('auth/register')->has('accountTypes', 2));
});

it('registers an individual and a company, never an admin', function () {
    $this->post(route('register.store'), [
        'account_type' => 'particulier',
        'name' => 'Claire',
        'email' => 'Claire@Example.com',
        'company' => 'Ignorée',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect(route('dashboard'));

    $claire = User::where('email', 'claire@example.com')->sole();

    expect($claire->account_type)->toBe(AccountType::Individual)
        ->and($claire->company)->toBeNull()
        ->and($claire->canAccessPanel(Filament::getPanel('admin')))->toBeFalse();
    $this->assertAuthenticatedAs($claire);

    auth()->logout();

    $this->post(route('register.store'), [
        'account_type' => 'entreprise',
        'name' => 'Laure',
        'email' => 'laure@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors('company');

    $this->post(route('register.store'), [
        'account_type' => 'admin',
        'role' => 'admin',
        'name' => 'Pirate',
        'email' => 'pirate@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors('account_type');

    expect(User::count())->toBe(1);
});

it('logs a customer in and out', function () {
    $user = User::factory()->individual()->create();

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'faux'])->assertSessionHasErrors('email');
    $this->assertGuest();

    $this->post(route('login.store'), ['email' => ' '.strtoupper($user->email), 'password' => 'password'])->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($user);

    $this->post(route('logout'))->assertRedirect(route('home'));
    $this->assertGuest();
});

it('keeps customers out of the back office and shows admins the same React dashboard', function () {
    $this->actingAs(User::factory()->company()->create())->get('/admin')->assertForbidden();

    $this->actingAs(User::factory()->create())->get('/dashboard')
        ->assertInertia(fn (Assert $page) => $page->component('dashboard')->where('account.admin_url', null));

    $this->actingAs(User::factory()->admin()->create())->get('/dashboard')
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('account.admin_url', route('filament.admin.pages.dashboard')));
});

it('makes every new account a plain user until promoted', function () {
    $user = User::create(['name' => 'Nouvelle', 'email' => 'nouvelle@example.com', 'password' => 'password', 'role' => 'admin']);

    expect($user->fresh()->role)->toBe(UserRole::User)
        ->and($user->fresh()->isAdmin())->toBeFalse();

    $this->artisan('user:admin', ['email' => 'nouvelle@example.com'])->assertSuccessful();
    $this->artisan('user:admin', ['email' => 'inconnu@example.com'])->assertFailed();

    expect($user->fresh()->isAdmin())->toBeTrue();
});

it('shows a customer only their own bookings and requests', function () {
    $session = openSession();
    $user = User::factory()->individual()->create();
    $other = User::factory()->individual()->create();

    foreach ([$user, $other] as $owner) {
        Booking::create(['user_id' => $owner->id, 'experience_session_id' => $session->id, 'name' => $owner->name, 'email' => $owner->email, 'seats' => 2, 'amount_cents' => 14000, 'status' => BookingStatus::Paid]);
        Inquiry::create(['user_id' => $owner->id, 'type' => InquiryType::Contact, 'name' => $owner->name, 'email' => $owner->email, 'message' => 'Bonjour', 'internal_notes' => 'Secret']);
    }

    $this->actingAs($user)->get('/dashboard')
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('account.type.value', 'particulier')
            ->where('account.can_book_online', true)
            ->has('bookings', 1)
            ->where('bookings.0.amount', 140)
            ->where('bookings.0.can_cancel', true)
            ->where('bookings.0.experience.title', 'Lactofermentation')
            ->has('inquiries', 1)
            ->where('inquiries.0.status.label', 'Reçue')
            ->missing('inquiries.0.internal_notes'));
});

it('lets an individual book seats, recorded as paid without a payment step', function () {
    $session = openSession();
    $user = User::factory()->individual()->create(['phone' => '06 00 00 00 00']);

    $this->actingAs($user)->post(route('bookings.store', $session), ['seats' => 3, ...demoCard()])->assertRedirect(route('dashboard'));

    $booking = Booking::sole();

    expect($booking->user_id)->toBe($user->id)
        ->and($booking->email)->toBe($user->email)
        ->and($booking->phone)->toBe('06 00 00 00 00')
        ->and($booking->amount_cents)->toBe(21000)
        ->and($booking->status)->toBe(BookingStatus::Paid)
        ->and($booking->paid_at)->not->toBeNull()
        ->and($session->remainingSeats())->toBe(7);
});

it('refuses online booking to companies and guests', function () {
    $session = openSession();

    $this->post(route('bookings.store', $session), ['seats' => 1])->assertRedirect(route('login'));
    $this->actingAs(User::factory()->company()->create())->post(route('bookings.store', $session), ['seats' => 1, ...demoCard()])->assertForbidden();

    expect(Booking::count())->toBe(0);
});

it('refuses to overbook a session or to book a past one', function () {
    $session = openSession(capacity: 2);
    $this->actingAs(User::factory()->individual()->create());

    $this->post(route('bookings.store', $session), ['seats' => 3, ...demoCard()])->assertSessionHasErrors('seats');

    $session->update(['starts_at' => now()->subDay()]);
    $this->post(route('bookings.store', $session), ['seats' => 1, ...demoCard()])->assertSessionHasErrors('seats');

    expect(Booking::count())->toBe(0);
});

it('lets a customer cancel their own upcoming booking only', function () {
    $session = openSession();
    $user = User::factory()->individual()->create();
    $booking = Booking::create(['user_id' => $user->id, 'experience_session_id' => $session->id, 'name' => 'A', 'email' => 'a@example.com', 'seats' => 1, 'amount_cents' => 7000, 'status' => BookingStatus::Paid]);

    $this->actingAs(User::factory()->individual()->create())->patch(route('dashboard.bookings.cancel', $booking))->assertNotFound();
    expect($booking->fresh()->status)->toBe(BookingStatus::Paid);

    $this->actingAs($user)->patch(route('dashboard.bookings.cancel', $booking))->assertRedirect(route('dashboard'));
    expect($booking->fresh()->status)->toBe(BookingStatus::Cancelled);

    $this->patch(route('dashboard.bookings.cancel', $booking))->assertSessionHasErrors('booking');
});

it('updates the profile and the password', function () {
    $user = User::factory()->company()->create();
    User::factory()->create(['email' => 'pris@example.com']);
    $this->actingAs($user);

    $this->put(route('dashboard.profile.update'), ['name' => 'Laure', 'email' => 'pris@example.com', 'company' => ''])
        ->assertSessionHasErrors(['email', 'company']);

    $this->put(route('dashboard.profile.update'), ['name' => 'Laure', 'email' => 'laure@example.com', 'phone' => '', 'company' => 'Acme', 'role' => 'admin'])
        ->assertRedirect(route('dashboard'));

    expect($user->fresh())->name->toBe('Laure')->company->toBe('Acme')->phone->toBeNull()->account_type->toBe(AccountType::Company)->role->toBe(UserRole::User);

    $this->put(route('dashboard.password.update'), ['current_password' => 'faux', 'password' => 'nouveau-secret', 'password_confirmation' => 'nouveau-secret'])
        ->assertSessionHasErrors('current_password');

    $this->put(route('dashboard.password.update'), ['current_password' => 'password', 'password' => 'nouveau-secret', 'password_confirmation' => 'nouveau-secret'])
        ->assertSessionHasNoErrors();

    expect(Hash::check('nouveau-secret', $user->fresh()->password))->toBeTrue();
});

it('attaches a quote request to the signed-in account', function () {
    $user = User::factory()->company()->create();

    $this->actingAs($user)->post(route('contact.store'), [
        'type' => 'devis_experience',
        'name' => $user->name,
        'email' => $user->email,
        'message' => 'Un atelier pour notre équipe.',
        'user_id' => 999,
    ])->assertRedirect(route('contact'));

    expect(Inquiry::sole()->user_id)->toBe($user->id);
});

it('seeds one demo account of each type with their data', function () {
    $this->seed();

    expect(User::where('email', 'particulier@example.com')->sole()->bookings()->count())->toBeGreaterThan(0)
        ->and(User::where('email', 'entreprise@example.com')->sole()->inquiries()->count())->toBeGreaterThan(0)
        ->and(User::where('email', 'test@example.com')->sole()->isAdmin())->toBeTrue();
});

it('saves podcasts to listen to later and lists them on the dashboard', function () {
    $podcast = Podcast::create(['title' => 'La pêche durable', 'slug' => 'la-peche-durable', 'link' => 'https://smartlink.ausha.co/la-recette']);
    $other = Podcast::create(['title' => 'Le pain', 'slug' => 'le-pain', 'link' => 'https://smartlink.ausha.co/la-recette']);
    $user = User::factory()->company()->create();

    $this->post(route('podcasts.favorite', $podcast))->assertRedirect(route('login'));

    $this->actingAs($user)->from(route('podcasts.index'))->post(route('podcasts.favorite', $podcast))->assertRedirect(route('podcasts.index'));

    $this->get(route('podcasts.index'))
        ->assertInertia(fn (Assert $page) => $page->where('podcasts', fn ($podcasts) => collect($podcasts)->pluck('is_favorite', 'slug')->all() == ['la-peche-durable' => true, 'le-pain' => false]));

    $this->get('/dashboard')
        ->assertInertia(fn (Assert $page) => $page->has('favoritePodcasts', 1)->where('favoritePodcasts.0.slug', 'la-peche-durable')->where('favoritePodcasts.0.is_favorite', true));

    $this->actingAs(User::factory()->individual()->create())->get('/dashboard')
        ->assertInertia(fn (Assert $page) => $page->has('favoritePodcasts', 0));

    $this->actingAs($user)->post(route('podcasts.favorite', $podcast));

    expect($user->favoritePodcasts()->count())->toBe(0)->and($other->exists)->toBeTrue();
});

it('shows the demo payment page to individuals only', function () {
    $session = openSession(capacity: 4);

    $this->get(route('bookings.create', ['session' => $session, 'seats' => 2]))->assertRedirect(route('login'));

    $this->actingAs(User::factory()->company()->create())->get(route('bookings.create', $session))
        ->assertRedirect(route('contact', ['type' => 'devis_experience', 'experience_type' => 'atelier']));

    $this->actingAs(User::factory()->individual()->create());

    $this->get(route('bookings.create', ['session' => $session, 'seats' => 2]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('bookings/checkout')
            ->where('experience.title', 'Lactofermentation')
            ->where('session.price', 70)
            ->where('session.remaining_seats', 4)
            ->where('seats', 2));

    // More seats asked than left: capped rather than refused.
    $this->get(route('bookings.create', ['session' => $session, 'seats' => 9]))
        ->assertInertia(fn (Assert $page) => $page->where('seats', 4));

    $session->update(['starts_at' => now()->subDay()]);
    $this->get(route('bookings.create', $session))->assertNotFound();
});

it('refuses a booking without valid demo card details and never stores them', function () {
    $session = openSession();
    $this->actingAs(User::factory()->individual()->create());

    $this->post(route('bookings.store', $session), ['seats' => 1, 'card_name' => '', 'card_number' => '1234', 'card_expiry' => '01/20', 'card_cvc' => 'abc'])
        ->assertSessionHasErrors(['card_name', 'card_number', 'card_expiry', 'card_cvc']);

    expect(Booking::count())->toBe(0);

    $this->post(route('bookings.store', $session), ['seats' => 1, ...demoCard()])->assertSessionHasNoErrors();

    expect(json_encode(Booking::sole()->getAttributes()))->not->toContain('4242');
});

it('saves the episode a guest bookmarked once they sign in, and brings them back', function () {
    $podcast = Podcast::create(['title' => 'La pêche durable', 'slug' => 'la-peche-durable', 'link' => 'https://smartlink.ausha.co/la-recette']);
    $user = User::factory()->individual()->create();

    $this->from(route('podcasts.show', $podcast))->post(route('podcasts.favorite', $podcast))->assertRedirect(route('login'));

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password'])->assertRedirect(route('podcasts.show', $podcast));

    expect($user->favoritePodcasts()->pluck('slug')->all())->toBe(['la-peche-durable']);

    // Signing in again later does not replay or toggle it off.
    auth()->logout();
    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password']);

    expect($user->favoritePodcasts()->count())->toBe(1);
});
