import { Card } from "../components/ui/card";
import { Target, Users, Lightbulb, Heart, Sparkles } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function MissionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-violet-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-800 via-violet-700 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl mb-6">About Divas in Technology</h1>
            <p className= "text-2xl max-w-3xl mx-auto opacity-95">
Divas in Technology (DTech) is a nonprofit organization focused on empowering girls in technology and changing the future. 
By hosting programs that teach various computer science skills, we hope to increase interest in tech-related fields and increase 
enrollment in computer science courses in school. DTech is run by high school and college students in Wisconsin who are passionate 
              about helping girls get access to tech opportunities and mentorship early on. 
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-purple-700 via-violet-600 to-purple-600 p-8 text-white shadow-xl sm:p-10">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

            <div className="relative text-center">
              <h2 className="text-4xl mb-6 text-white">Our Vision</h2>
              <p className="mx-auto max-w-4xl text-lg leading-8 text-white/90 sm:text-xl">
                With women making up only 23% of computer science students in Wisconsin, Divas in Technology aims to increase that number to 50% by providing resources, mentorship, and a community to young girls interested in the tech field.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 bg-white shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl mb-6 text-purple-900">Our Mission </h2>
                <p className="text-lg text-gray-700 mb-4">
                  Divas in Tech is a community-driven organization dedicated to closing the gender gap in technology. 
                  We believe that diversity drives innovation, and that every woman deserves the opportunity to thrive 
                  in the tech industry.
                </p>
                <p className="text-lg text-gray-700">
                  Through mentorship, education, networking, and advocacy, we create pathways for women to enter, 
                  advance, and lead in technology careers.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1563737590014-5d5c37378130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHRlY2hub2xvZ3klMjBjb21wdXRlcnxlbnwxfHx8fDE3NjEyNTI0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Women in technology"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-purple-900">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 p-4 rounded-full">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl mb-3 text-purple-900">Inclusion</h3>
              <p className="text-gray-600">
                We create welcoming spaces where all girls, regardless of background or experience level, 
                can connect, learn, and grow together.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-purple-100 to-violet-200 p-4 rounded-full">
                  <Lightbulb className="w-8 h-8 text-purple-700" />
                </div>
              </div>
              <h3 className="text-xl mb-3 text-purple-900">Innovation</h3>
              <p className="text-gray-600">
                We encourage creative thinking and bold ideas, fostering an environment where women 
                can experiment, fail forward, and innovate.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 p-4 rounded-full">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl mb-3 text-purple-900">Empowerment</h3>
              <p className="text-gray-600">
                We provide the tools, resources, and support women need to confidently pursue their 
                goals and reach their full potential in tech.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-purple-900">What We Do</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <Card className="w-full max-w-xl p-6 border-l-4 border-purple-600">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">Mentorship Program</h3>
                  <p className="text-gray-600">
                    Connect with experienced professionals who provide guidance, career advice, and 
                    support as you navigate your tech journey.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="w-full max-w-xl p-6 border-l-4 border-purple-500">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-lg flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-purple-700" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">Skill Development</h3>
                  <p className="text-gray-600">
                    Access workshops, coding bootcamps, and training sessions covering everything from 
                    programming basics to advanced tech skills.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="w-full max-w-xl p-6 border-l-4 border-violet-600">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-violet-100 to-purple-200 p-3 rounded-lg flex-shrink-0">
                  <Users className="w-6 h-6 text-violet-700" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">Networking Events</h3>
                  <p className="text-gray-600">
                    Join social events to build meaningful connections 
                    with other women in tech.
                  </p>
                </div>
              </div>
            </Card>
            {/* Card for later */}
            {/* <Card className="p-6 border-l-4 border-purple-600">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">Workshops</h3>
                  <p className="text-gray-600">
                    Get help with resumé reviews, interview prep, job placement assistance, and career 
                    advancement strategies.
                  </p>
                </div>
              </div>
            </Card> */}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-700 via-violet-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-6 text-white">Join Our Mission</h2>
          <p className="text-xl text-white mb-8">
            Whether you're just starting your tech journey or you're an experienced professional looking 
            to give back, there's a place for you in our community. Together, we're building a more 
            inclusive and innovative tech industry.
          </p>
          <p className="text-lg text-white">
            Login to connect with our community, access exclusive resources, and participate in upcoming events.
          </p>
        </div>
      </section>
    </div>
  );
}
