
'use client';

import { useRouter } from 'next/navigation';
import { 
  AcademicCapIcon, 
  CalculatorIcon, 
  CodeBracketIcon,
  BeakerIcon,
  BookOpenIcon,
  PencilIcon,
  LanguageIcon,
  ChartBarIcon,
  MusicalNoteIcon,
  HeartIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface Subject {
  id: string;
  name: string;
  icon: any;
  tutorCount: number;
  description: string;
  avgRating: number;
  popularity: 'High' | 'Medium' | 'Low';
}

export default function SubjectsSection() {
  const router = useRouter();

  // Featured subjects for tutoring
  const featuredSubjects: Subject[] = [
    {
      id: 'math',
      name: 'Mathematics',
      icon: CalculatorIcon,
      tutorCount: 28,
      description: 'Algebra, Calculus, Statistics',
      avgRating: 4.8,
      popularity: 'High'
    },
    {
      id: 'programming',
      name: 'Programming',
      icon: CodeBracketIcon,
      tutorCount: 35,
      description: 'Python, JavaScript, Web Dev',
      avgRating: 4.9,
      popularity: 'High'
    },
    {
      id: 'science',
      name: 'Science',
      icon: BeakerIcon,
      tutorCount: 22,
      description: 'Physics, Chemistry, Biology',
      avgRating: 4.7,
      popularity: 'High'
    },
    {
      id: 'english',
      name: 'English & Writing',
      icon: BookOpenIcon,
      tutorCount: 18,
      description: 'Grammar, Essay Writing, IELTS',
      avgRating: 4.6,
      popularity: 'Medium'
    },
    {
      id: 'business',
      name: 'Business Studies',
      icon: ChartBarIcon,
      tutorCount: 15,
      description: 'Finance, Marketing, Economics',
      avgRating: 4.7,
      popularity: 'Medium'
    },
    {
      id: 'languages',
      name: 'Foreign Languages',
      icon: LanguageIcon,
      tutorCount: 25,
      description: 'Spanish, French, Japanese',
      avgRating: 4.8,
      popularity: 'High'
    },
    {
      id: 'test-prep',
      name: 'Test Preparation',
      icon: AcademicCapIcon,
      tutorCount: 20,
      description: 'SAT, GRE, GMAT, TOEFL',
      avgRating: 4.9,
      popularity: 'High'
    },
    {
      id: 'music',
      name: 'Music Lessons',
      icon: MusicalNoteIcon,
      tutorCount: 12,
      description: 'Piano, Guitar, Violin',
      avgRating: 4.8,
      popularity: 'Medium'
    }
  ];

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/tutors?subject=${subjectId}`);
  };

  const handleBookTutor = () => {
    router.push('/tutors');
  };

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'High': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular <span className="text-yellow-500">Tutoring Subjects</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find expert tutors for your favorite subjects. Book 1-on-1 sessions and accelerate your learning.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-yellow-500">150+</div>
            <div className="text-sm text-gray-600">Expert Tutors</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-yellow-500">4.8</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-yellow-500">50+</div>
            <div className="text-sm text-gray-600">Subjects</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-yellow-500">24/7</div>
            <div className="text-sm text-gray-600">Availability</div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredSubjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <div
                key={subject.id}
                onClick={() => handleSubjectClick(subject.id)}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-200/50 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                {/* Subject Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-7 h-7 text-yellow-600" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPopularityColor(subject.popularity)}`}>
                    {subject.popularity} Demand
                  </span>
                </div>

                {/* Subject Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                  {subject.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-4">
                  {subject.description}
                </p>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <UserGroupIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{subject.tutorCount} tutors</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-yellow-600">{subject.avgRating}/5</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ 
                        width: `${subject.popularity === 'High' ? '90%' : subject.popularity === 'Medium' ? '70%' : '50%'}` 
                      }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubjectClick(subject.id);
                  }}
                  className="w-full mt-4 px-4 py-2 bg-yellow-50 text-yellow-600 font-medium rounded-lg hover:bg-yellow-100 transition-colors text-sm"
                >
                  Find Tutors
                </button>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 text-center text-gray-900 shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Connect with certified tutors for personalized 1-on-1 sessions. Flexible scheduling and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBookTutor}
              className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
            >
              Book a Tutor Now
            </button>
            <button
              onClick={() => router.push('/tutors')}
              className="px-8 py-3 bg-white/90 text-gray-900 font-semibold rounded-lg hover:bg-white transition-colors"
            >
              Browse All Tutors
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}