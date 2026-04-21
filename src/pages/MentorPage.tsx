import { Card } from "../components/ui/card";
import {Button} from "../components/ui/button";
import {Crown, LucideIcon } from "lucide-react";

{/*Only make this page appear when logged in for all types of users, 
when admin is logged in they are able to remove or add mentors.
- make a button where once the user presses the button a message box and email 
    will appears and they are able to contact the person they chose*/}

interface Mentor {
  id: number;
  name: string;
  email:string;
  bio: string;
  icon: LucideIcon;
  color: "purple" | "violet";
  image: string;
}

export function MentorPage() {
    const mentors: Mentor[] = [
    {
            id: 1,
            name: "Mentor Name",
            email:"mentor1@example.com",
            bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            icon: Crown,
            color: "purple",
            image: "mentor1"
        },
        {
            id: 2,
            name: "Mentor Name",
            email:"mentor2@example.com",
            bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            icon: Crown,
            color: "violet",
            image: "mentor2"
        },
        {
            id: 3,
            name: "Mentor Name",
            email:"mentor3@example.com",
            bio:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            icon: Crown,
            color: "purple",
            image: "mentor3"
        },
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
            {/* title section */}
            <section className="bg-gradient-to-r from-purple-800 via-violet-700 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl mb-6">Our Mentors</h1>
                        <p className="text-xl max-w-3xl mx-auto opacity-95">
                            Meet the passionate Mentors who are the heart of Divas in Tech. 
                            Our volunteers dedicate their time and skills to support our mission of empowering women
                            in technology through mentorship, events, and community building.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mentors Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {mentors.map((mentor) => {
                            const colors = getColorClasses(mentor.color);
                            const Icon = mentor.icon;

                            return (
                                <Card
                                    key={mentor.id}
                                    className={`p-8 hover:shadow-xl transition-shadow border-t-4 ${colors.border}`}
                                >
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className={`bg-gradient-to-br ${colors.gradient} p-4 rounded-full flex-shrink-0`}>
                                            <Icon className={`w-8 h-8 ${colors.text}`} />
                                        </div>
                                        <div className = "flex-1">
                                            <h2 className= "text-2xl text-purple-900 mb-1">{mentor.name}</h2>
                                        </div>
                                    </div>
                                    <p className = "text-gray-700 leading-relaxed mb-6">
                                        {mentor.bio}
                                    </p>

                                    {/*<Button
                                        className={`w-full ${colors.btnBg} text-white`}
                                        onClick={() => window.location.href = `mailto:${mentor.email}`}
                                        >
                                        <Icon className="w-4 h-4 mr-2" />
                                        Contact Mentor
                                    </Button>
                                    
                                    Would send a direct message to the mentor thorugh their email once they press to contact them*/}
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
            {/*Be a mentor section*/}
            <section className="py-16 bg-gradient-to-r from-purple-700 via-violet-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl mb-6"> Want to be a Mentor?</h2>
                    <p className="text-xl opacity-95 mb-8">
                        Our mentors are the heart of Divas in Tech, dedicating their time and expertise to empower 
                        the next generation.
                    </p>
                    <p className="text-lg opacity-90">
                        If you're passionate about supporting women in technology and want to make a difference, we invite you to join our mentorship program.
                        As a mentor, you'll have the opportunity to guide, inspire, and connect with aspiring women in tech, helping them navigate their careers and achieve their goals.
                    </p>
                </div>
            </section>
        </div>
    );
}