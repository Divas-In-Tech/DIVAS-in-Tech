import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Linkedin, Crown, Users, Wallet, Palette, LucideIcon } from "lucide-react";

interface BoardMember {
  id: number;
  name: string;
  title: string;
  bio: string;
  icon: LucideIcon;
  color: "purple" | "violet";
  linkedIn: string;
}

export function BoardPage() {
  const boardMembers: BoardMember[] = [
    {
      id: 1,
      name: "Tania Mishra",
      title: "Founder, President",
      bio: "Tania Mishra is a student at Marquette University. Tania has been interested in technology since her first digital exploration class in 6th grade. Since then, she has been involved in multiple programs focused on empowering and inspiring girls in tech, such as ProjectCSGirls and Girls Who Code. Tania is also a 2021 National Winner and 3-times Wisconsin Affiliate winner for NCWIT's Aspirations in Computing Award. She has interned at Northwestern Mutual as a mainframe developer, a full-stack developer, and a student instructor for the high school intern program. Tania wants to help lead more girls into the path of computer science, and she hopes to accomplish this through DTech!",
      icon: Crown,
      color: "purple",
      linkedIn: "https://www.linkedin.com/in/taniamishra127/"
    },
    {
      id: 2,
      name: "Sarah Rubenstein",
      title: "Vice President",
      bio: "Sarah Rubenstein is a student at UW Madison who is majoring in computer science. She's been coding since middle school and has experience in a variety of languages such as Java, JavaScript, Python, and HTML/CSS. She was the software lead on her high school's FIRST robotics team. Sarah has interned at Northwestern Mutual as a web developer, and at Concurrency where she worked with cloud computing. She is passionate about teaching others to code and excited to work with students.",
      icon: Users,
      color: "violet",
      linkedIn: "https://www.linkedin.com/in/sarah-rubenstein-b042471b1/"
    },
    {
      id: 3,
      name: "Sanjana Tarigoppula",
      title: "Treasurer",
      bio: "Sanjana Tarigoppula is a student at the University of Wisconsin-Madison. She started coding her sophomore year of high school, and is now majoring in Computer Sciences and pursuing a certificate in Business. Sanjana has interned at GE Healthcare and gained experience in Technical Product Management and Software Engineering. She will be continuing her journey at GE Healthcare as a full-time DTLP after graduation. Sanjana is very excited to serve on the board for Divas in Technology and increase awareness on tech careers!",
      icon: Wallet,
      color: "purple",
      linkedIn: "https://www.linkedin.com/in/sanjanatarigoppula/"
    },
    {
      id: 4,
      name: "Alyshba Sharwani",
      title: "Secretary, Designer",
      bio: "Alyshba Sharwani is a student at the University of Wisconsin-Madison, where she is planning on completing a double major in Statistics and English and a minor in Textiles and Fashion Design. Her past extracurricular leadership experiences and organizational skills guide her role as Secretary of DTech, while her interest and experiences in art and design, including receiving several Scholastic art awards, lead her work as Brand Designer of DTech.",
      icon: Palette,
      color: "violet",
      linkedIn: "https://www.linkedin.com/in/alyshba-sharwani/"
    }
  ];

  const getColorClasses = (color: "purple" | "violet") => {
    if (color === "violet") {
      return {
        bg: "bg-violet-100",
        text: "text-violet-700",
        border: "border-violet-600",
        gradient: "from-violet-100 to-purple-200",
        btnBg: "bg-violet-600 hover:bg-violet-700"
      };
    }
    return {
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-600",
      gradient: "from-purple-100 to-violet-200",
      btnBg: "bg-purple-600 hover:bg-purple-700"
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-violet-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-800 via-violet-700 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl mb-6">Our Board Members</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-95">
              Meet the passionate leaders driving Divas in Tech forward. Our board members are 
              dedicated students and professionals committed to empowering the next generation 
              of women in technology.
            </p>
          </div>
        </div>
      </section>

      {/* Board Members Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {boardMembers.map((member) => {
              const colors = getColorClasses(member.color);
              const Icon = member.icon;
              
              return (
                <Card 
                  key={member.id} 
                  className={`p-8 hover:shadow-xl transition-shadow border-t-4 ${colors.border}`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`bg-gradient-to-br ${colors.gradient} p-4 rounded-full flex-shrink-0`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl text-purple-900 mb-1">{member.name}</h2>
                      <p className={`${colors.text}`}>{member.title}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {member.bio}
                  </p>
                  
                  <Button 
                    className={`w-full ${colors.btnBg} text-white`}
                    onClick={() => window.open(member.linkedIn, '_blank')}
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    Connect on LinkedIn
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-16 bg-gradient-to-r from-purple-700 via-violet-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-6">Join Our Community</h2>
          <p className="text-xl opacity-95 mb-8">
            Our board members are here to support, mentor, and guide the next generation of women in tech. 
            Connect with them and the broader Divas in Tech community to access resources, mentorship, 
            and opportunities.
          </p>
          <p className="text-lg opacity-90">
            Login to engage with our board members and participate in our programs.
          </p>
        </div>
      </section>
    </div>
  );
}