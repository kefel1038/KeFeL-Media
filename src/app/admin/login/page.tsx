import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand text-white text-2xl font-black mb-4">
            K
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            KeFeL Media
          </h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
