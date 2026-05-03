import FeedbackForm from '@/components/FeedbackForm';

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
      {/* Soft background mesh gradient */}
      <div className="bg-mesh"></div>
      
      <div className="w-full max-w-xl z-10">
        <header className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full">
            Feedback System
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            We'd love to hear from you
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed">
            Your feedback helps us build a better experience for everyone.
          </p>
        </header>
        
        <FeedbackForm />
        
        <div className="mt-12 text-center">
        </div>
      </div>

      <footer className="mt-20 text-gray-400 text-sm font-medium">
        &copy; {new Date().getFullYear()} Feedback Inc. All rights reserved.
      </footer>
    </main>
  );
}
