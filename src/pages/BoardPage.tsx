import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Linkedin, Crown, Users, Wallet, NotebookPenIcon, LucideIcon } from "lucide-react";

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
      bio: "Tania Mishra is PhD student at the University of Michigan-Ann Arbor, pursuing a degree in Information. She graduated from Marquette University with a B.S. in Computer Science and Cognitive Science, with minors in Gender and Sexuality Studies and Dance and a concentration in Innovation Leadership. Tania has been involved in organizations such as ProjectCSGirls, Girls Who Code, and NCWIT. Tania founded Divas in Technology in 2020 with the goal of leading more girls into the path of computer science! ",
      icon: Crown,
      color: "purple",
      linkedIn: "https://www.linkedin.com/in/taniamishra127/"
    },
    // Commented out for now until we have more board members to add
    // {
    //   id: 2,
    //   name: "",
    //   title: "Vice President",
    //   bio: "",
    //   icon: Users,
    //   color: "violet",
    //   linkedIn: ""
    // },
    // {
    //   id: 3,
    //   name: "",
    //   title: "Treasurer",
    //   bio: "",
    //   icon: Wallet,
    //   color: "purple",
    //   linkedIn: ""
    // },
    // {
    //   id: 4,
    //   name: "",
    //   title: "",
    //   bio: "",
    //   icon: NotebookPenIcon,
    //   color: "violet",
    //   linkedIn: ""
    // }
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