<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $this->user($request),
            ],
            'settings' => fn (): array => $this->settings(),
        ];
    }

    /**
     * The signed-in account, reduced to what the header and forms need.
     *
     * @return array<string, mixed>|null
     */
    protected function user(Request $request): ?array
    {
        $user = $request->user();

        if (! $user instanceof User) {
            return null;
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'company' => $user->company,
            'account_type' => $user->account_type->value,
        ];
    }

    /**
     * Site settings edited in the back office, with the about photo as a URL.
     *
     * @return array<string, string|null>
     */
    protected function settings(): array
    {
        $settings = Setting::values();

        $settings['about_photo_url'] = filled($settings['about_photo'] ?? null)
            ? Storage::disk('public')->url($settings['about_photo'])
            : null;

        unset($settings['about_photo']);

        return $settings;
    }
}
