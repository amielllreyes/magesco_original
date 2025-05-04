"use client";

export default function PaymentSuccess() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-12 bg-lightblue bg-[url('/layeredwaves.svg')] bg-no-repeat bg-bottom bg-cover">
      <div className="bg-white bg-opacity-40 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-2xl text-center">
        <h1 className="text-4xl sm:text-6xl font-bold from-blue-500 to-slate-400 bg-gradient-to-br text-transparent bg-clip-text mb-6">
          Payment Successful!
        </h1>
        <p className="text-xl mb-8">Thank you for your purchase.</p>
        <a 
          href="/" 
          className="mt-4 w-full text-white font-medium px-6 py-3 rounded-lg transition bg-blue-600 hover:bg-blue-700 inline-block max-w-xs mx-auto"
        >
          Return to Home
        </a>
      </div>
    </main>
  );
}