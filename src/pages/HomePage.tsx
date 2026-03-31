import { Card } from "../components/ui/card";
import { Heart, Users, Target, HandHeart } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-violet-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758599668125-e154250f24bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB2b2x1bnRlZXJzJTIwaGVscGluZ3xlbnwxfHx8fDE3NjEwNzA2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Community volunteers"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-violet-800/70 to-purple-700/60 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-5xl mb-4">Divas in Technology</h1>
            <p className="text-xl opacity-95">
              From This STEM, A Flower Blooms
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">Who we are?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DTech is a student-run organization that works to provide young girls with invaluable technological skills and knowledge, 
            empowering girls and thereby changing the future. We are proud to offer a wide array of technology programs for girls of all ages, 
            ethnicities, and backgrounds. DTech's programs are based on our experiences as women in STEM, and we aim to provide a safe 
            space for girls to explore technology.


          </p>
        </div>

        {/* Values Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow border-t-4 border-purple-400">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-purple-700" />
            </div>
            <h3 className="text-xl mb-3">Compassion</h3>
            <p className="text-gray-600">
              We lead with empathy and understanding, ensuring every action is driven by genuine care for others.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow border-t-4 border-violet-500">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-violet-700" />
            </div>
            <h3 className="text-xl mb-3">Community</h3>
            <p className="text-gray-600">
              We believe in the power of collective action and bringing people together for common goals.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow border-t-4 border-purple-600">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-violet-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-purple-800" />
            </div>
            <h3 className="text-xl mb-3">Impact</h3>
            <p className="text-gray-600">
              We focus on sustainable solutions that create meaningful and lasting change in people's lives.
            </p>
          </Card>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl text-gray-900 mb-6">What We Do</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <HandHeart className="w-6 h-6 text-purple-700 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="mb-2">Volunteer Programs</h4>
                    <p className="text-gray-600">
                      Connect passionate volunteers with meaningful opportunities to serve their communities.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Users className="w-6 h-6 text-violet-700 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="mb-2">Community Events</h4>
                    <p className="text-gray-600">
                      Organize events that bring people together and strengthen community bonds.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Target className="w-6 h-6 text-purple-800 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="mb-2">Impact Initiatives</h4>
                    <p className="text-gray-600">
                      Launch targeted programs addressing critical needs in education, health, and social services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1665072204431-b3ba11bd6d06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzYxMTA1MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-100 via-violet-100 to-purple-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl text-purple-900 mb-4">Join Our Community</h2>
          <p className="text-xl text-purple-700 mb-8 max-w-2xl mx-auto">
            Login to add events, connect with mentors, and participate in our mission to make a difference.
          </p>
        </div>
      </section>
    </div>
  );
}