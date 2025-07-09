import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
  CircleDollarSign,
  TrendingUp,
  Shield,
  Zap,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function Welcome({ auth }: PageProps) {
  const features = [
    {
      icon: Users,
      title: "Role Management",
      description:
        "Super admins can add admins. Admins can add users. Super admins can activate or deactivate any user or admin. Admins can activate or deactivate users they manage.",
    },
    {
      icon: Shield,
      title: "Hierarchical Deactivation",
      description:
        "When an admin is deactivated, all users managed by them are also deactivated automatically.",
    },
    {
      icon: BarChart3,
      title: "Wallets for Users",
      description:
        "Every user account created by an admin gets a wallet with a starting balance of 1000. Only user accounts have wallets.",
    },
    {
      icon: TrendingUp,
      title: "User Transactions",
      description:
        "Users can make transactions to other user accounts. All transactions are tracked and visible to the appropriate roles.",
    },
    {
      icon: Zap,
      title: "Activity Visibility",
      description:
        "Super admins can see all system-wide activity. Admins see activity of the users they manage.",
    },
    {
      icon: CheckCircle,
      title: "Secure & Auditable",
      description:
        "When a user account is activated or deactivated, their wallet is also activated or deactivated. When an admin is activated or deactivated, all users they manage and their wallets are updated accordingly.",
    },
  ];

  return (
    <>
      <Head title="Chapa" />
      <div className="relative min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center space-x-3">
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-400 shadow">
                <CircleDollarSign className="h-6 w-6 text-white" />
              </span>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Chapa
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              {auth?.user ? (
                <Link
                  href={route('dashboard')}
                  className="rounded-lg bg-gradient-to-r from-green-600 to-green-500 px-6 py-2 font-medium text-white shadow transition hover:from-green-700 hover:to-green-600"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href={route('login')}
                  className="font-medium text-gray-600 transition hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </nav>

        <section className="relative overflow-hidden pt-20 pb-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800" />
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-400 shadow-2xl">
              <CircleDollarSign className="h-12 w-12 text-white drop-shadow" />
            </div>
            <h1 className="mb-4 text-5xl font-bold md:text-7xl">
              Chapa
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300 md:text-2xl">
              Chapa fullstack interview assignment made by Yishak Abraham
            </p>
          </div>
        </section>

        <section className="bg-white py-24 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">Project Features</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Explore the core features and role-based capabilities of the Chapa assignment.
              </p>
            </header>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="group rounded-2xl border border-transparent bg-gray-50 p-8 transition hover:border-green-200 hover:bg-white hover:shadow-xl dark:bg-gray-800 dark:hover:border-green-800 dark:hover:bg-gray-700"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-green-400 transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              {/* brand blurb */}
              <div>
                <div className="mb-4 flex items-center space-x-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-400">
                    <CircleDollarSign className="h-6 w-6 text-white" />
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                    Chapa
                  </span>
                </div>
                <p className="max-w-md text-gray-400">
                  Chapa fullstack interview assignment made by Yishak Abraham
                </p>
              </div>
              {/* contact info */}
              <div className="flex flex-col gap-2 justify-center md:items-end">
                <div className="font-semibold">Yishak Abraham Bantirgu</div>
                <div>Email: <a href="mailto:yishakab@24gmail.com" className="underline">yishakab@24gmail.com</a></div>
                <div>Phone: <a href="tel:0907968056" className="underline">0907968056</a></div>
                <div>GitHub: <a href="https://github.com/yishak-cs" className="underline" target="_blank" rel="noopener noreferrer">github.com/yishak-cs</a></div>
              </div>
            </div>
            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-sm md:flex-row">
              <p className="text-gray-400">© 2025 Chapa. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
