import { Card } from "../components/ui/card";
import {Button} from "../components/ui/button";
import {Crown, LucideIcon } from "lucide-react";


interface Mentor {
  id: number;
  name: string;
  bio: string;
  icon: LucideIcon;
  color: "purple" | "violet";
  image: string;
  email: string;
}

export function MentorPage() {
    const mentors: Mentor[] = [
        {
            id: 1,
            name: "Mentor Name",
            bio:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            icon: Crown,
            color: "purple",
            image: "mentor1",
            email:"mentor1@example.com"
        },
        {
            id: 2,
            name: "Mentor Name",
            bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            icon: Crown,
            color: "violet",
            image: "mentor2",
            email:"mentor2@example.com"
        },
        {
            id: 3,
            name: "Mentor Name",
            bio:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            icon: Crown,
            color: "purple",
            image: "mentor3",
            email:"mentor3@example.com"
        },
    ];

    const getColorClasses = (color: "purple" | "violet") => {
        if (color === "violet") {
            return {
                bg: "bg-violet-100",
                text: "text-violet-700",
                border: "border-violet-600",
                gradient: "from-violet-100 to-purple-200"
            };
        }
        return {
            bg: "bg-purple-100",
            text: "text-purple-700",
            border: "border-purple-600",
            gradient: "from-purple-100 to-violet-200"
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-violet-50 to-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-800 via-violet-700 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl mb-6">Our Volunteers</h1>
                        <p className="text-xl max-w-3xl mx-auto opacity-95">
                            Meet the passionate volunteers who are the heart of Divas in Tech. 
                            Our volunteers dedicate their time and skills to support our mission of empowering women
                            in technology through mentorship, events, and community building.
                        </p>
                    </div>
                </div>
            </section>

            {/* Volunteers Grid */}
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
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold ${colors.text}`}>{mentor.name}</h3>
                                            <p className="text-gray-600 mt-2">{mentor.bio}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className={`${colors.border} ${colors.text} hover:${colors.gradient}`}>
                                        View LinkedIn Profile
                                    </Button>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}