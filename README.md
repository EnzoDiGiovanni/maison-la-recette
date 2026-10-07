# maison-la-recette

## Filament create user to acces BO

run : `php artisan make:filament-user`

## Database and demo data

After pulling, run :

```bash
php artisan migrate
php artisan db:seed
php artisan storage:link
```

- `migrate` creates the tables (podcasts, speakers, experiences, sessions, bookings, inquiries, testimonials, posts, settings).
- `db:seed` fills every back-office resource with demo data. It can be run again : it creates no duplicates and never overwrites what was edited in the back office. It refuses to run in production.
- `storage:link` is needed once so uploaded images are displayed.

The seeder also creates a back-office account : `test@example.com` / `password`, and two customer accounts (same password) : `particulier@example.com` (individual, with bookings) and `entreprise@example.com` (company, with a quote request). Their demo bookings and requests are only linked on an empty database (`migrate:fresh --seed`).

## Customer accounts

`users.role` is `admin` or `utilisateur` (the default for every new account) : only admins reach the back office (`/admin`) and see the « Back-office » button on their dashboard. To give the role to an account, for instance one made with `make:filament-user` : `php artisan user:admin her@email.fr`.

`users.account_type` is `particulier` or `entreprise`. Visitors sign up on `/inscription` and find their account on `/dashboard`.

- Individuals book a session from an experience page, then pay on `/sessions/{id}/paiement`. Prototype : the card form is a demo (any 16-digit number, e.g. 4242 4242 4242 4242), nothing is charged or stored, and the booking is saved as paid. It then shows on the dashboard.
- Any signed-in account can save episodes with the bookmark on podcast cards (`podcast_user` table) ; they are listed under « À écouter plus tard » on the dashboard.
- Companies cannot book online : they send quote requests, which they follow on their dashboard.

To start again from an empty database : `php artisan migrate:fresh --seed` (this deletes all local data).

## Podcast episodes (Ausha)

Episodes are imported from the public RSS feed of the show on Ausha (`AUSHA_FEED_URL`, no API key needed) :

```bash
php artisan podcasts:sync
```

- The import runs every hour through the scheduler, which needs one cron entry on the server : `* * * * * php artisan schedule:run`. The « Synchroniser avec Ausha » button above the podcast list of the back office runs it right away.
- The main episodes and their extracts (any title containing EXTRAIT) are imported. The trailer, the other bonus episodes and titles starting with TEASER, REPLAY or REDIFFUSION are skipped.
- `/podcasts` shows « Podcasts à la une » (up to 5 episodes marked « à la une »), the episodes of the month (the current one, or the latest month with a release), the extracts, every episode from the latest to the oldest, 10 at a time, then the intervenants.
- A new episode gets its title, season, number, date, cover (downloaded to `storage/app/public/podcasts`), a summary cut before the credits, and the intervenant whose name is in its title when there is one. These are then edited freely in the back office : later imports only refresh the listening data (`link`, `audio_url`, `duration`, read-only in the form) and retry a cover that failed. Quote and « à la une » are always set by hand.
- An imported episode cannot be deleted in the back office, the next import would bring it back : untick « Visible sur le site » to take it off the site.
- The first import downloads every cover : run it from the command line rather than with the button.
- The episode page plays `audio_url` in a native `<audio>` player, and falls back to the pasted `iframe` for episodes without one.
- Demo episodes from `db:seed` are not in the feed : on a local database they stay next to the imported ones until deleted.

## Front pages

Every public page already exists as an unstyled React component that receives its data from Laravel. Front developers only add markup and styles.

| URL                       | Component (`resources/js/pages/`) | Props                                                                     |
| ------------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| `/`                       | `home.tsx`                        | `featuredPodcasts`, `experiences`, `testimonials`, `latestPosts`          |
| `/podcasts`               | `podcasts/index.tsx`              | `podcasts`                                                                |
| `/podcasts/{slug}`        | `podcasts/show.tsx`               | `podcast`                                                                 |
| `/podcasts/offres`        | `podcasts/offers.tsx`             | none (static content)                                                     |
| `/experiences`            | `experiences/index.tsx`           | `latestExperiences`, `pastEvents`                                         |
| `/experiences/{slug}`     | `experiences/show.tsx`            | `experience`, `sessions`, `testimonials`                                  |
| `/blog`                   | `posts/index.tsx`                 | `posts`                                                                   |
| `/blog/{slug}`            | `posts/show.tsx`                  | `post`                                                                    |
| `/a-propos`               | `about.tsx`                       | none (uses `settings`)                                                    |
| `/contact`                | `contact.tsx`                     | `defaultType`, `defaultExperienceType`, `inquiryTypes`, `experienceTypes` |
| `/connexion`              | `auth/login.tsx`                  | none                                                                      |
| `/inscription`            | `auth/register.tsx`               | `accountTypes`                                                            |
| `/sessions/{id}/paiement` | `bookings/checkout.tsx`           | `experience`, `session`, `seats`                                          |
| `/dashboard`              | `dashboard.tsx`                   | `account`, `favoritePodcasts`, `bookings`, `inquiries`                    |

- Prop types are in `resources/js/types/models.ts`.
- The signed-in account (or `null`) is available on every page with `usePage().props.auth.user`.
- `settings` (podcast figures, platform links, contact e-mail, about text) is available on every page with `usePage().props.settings`.
- The header, footer and success message are in `resources/js/layouts/site-layout.tsx`.
- Links use the generated route helpers in `@/routes` (regenerated by `npm run dev`).
- `/contact?type=devis_experience` or `?type=devis_podcast` preselects a quote request.
