import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:flex lg:items-center lg:justify-between">
        {/* Left Side: Text */}
        <div className="lg:w-1/2">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-700 leading-tight mt-5">
            <span className='text-yellow-400'>Connect</span> with <span className='text-yellow-400'>Expert</span> Tutors
          </h1>
          <p className="mt-6 text-lg text-gray-700">
            Learn from the best, schedule sessions instantly, and boost your skills with SkillBridge.
          </p>
          <div className="mt-8 flex gap-4">
            <a
              href="/register"
              className="px-6 py-3 bg-yellow-400 text-white font-semibold rounded-lg shadow hover:bg-yellow-500 transition"
            >
              Get Started
            </a>
            <Link
              href="/tutors"
              className="px-6 py-3 border border-yellow-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Browse Tutors
            </Link>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-full max-w-lg">
            <Image
              src="/hero-illustration.png" 
              alt="Tutoring Illustration"
              width={500}   
              height={400}  
            />
          </div>
        </div>
      </div>
    </section>
  );
}
