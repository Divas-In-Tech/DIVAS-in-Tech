import { Card } from "../components/ui/card";
import { Building2, GraduationCap, Sparkles, LucideIcon } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface Partner {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  color: "purple" | "violet";
  image: string;
}

export function PartnersPage() {
  const partners: Partner[] = [
    {
      id: 1,
      name: "Milwaukee School of Engineering",
      description: "The Milwaukee School of Engineering partners with DTech programs through their STEM outreach team and the We Energies STEM Center at MSOE. Located in Milwaukee, WI, MSOE offers bachelor's and master's degrees in top-ranked engineering, business and nursing programs. MSOE offers year round STEM outreach programs for K-12 students and educators.",
      icon: Building2,
      color: "purple",
      image: "https://msoe.s3.amazonaws.com/files/callouts/wide_xlrg_20191024-diercks-hall-exteriors-12-2.jpg"
    },
    {
      id: 2,
      name: "Edgewood College",
      description: "Edgewood's Office of Science Outreach (OSO) aims to support STEM education within and beyond the Edgewood community. They conduct science outreach activities for their community's youth, teachers, and general public. OSO encourages Edgewood's staff, faculty, and students to be involved in these outreach activities, and they empower other campus groups to become involved in spreading science education to the community.",
      icon: GraduationCap,
      color: "violet",
      image: "https://www.thoughtco.com/thmb/nGIxFR1wpg3mLoJvXGMW0k768zQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/edgewood-college-5a296cb347c2660036e31d96.jpg"
    },
    {
      id: 3,
      name: "Journey House",
      description: "Journey House's mission is to empower families of Southside Milwaukee to move out of poverty by offering Adult Education, Youth Development, THRIVE Workforce Development, and Family Engagement. Their vision is that every individual and family in Clarke Square will be given the tools and resources to succeed and contribute personally, professionally, and civically to the neighborhood and our greater Milwaukee community.",
      icon: Sparkles,
      color: "purple",
      image: "https://www.jsonline.com/gcdn/-mm-/a230d50c657011c52f8777f50aa9bb9213f49370/c=0-57-1920-1142/local/-/media/2019/01/31/WIGroup/Milwaukee/636845435746940481-Gurda-Journey-HOuse.jpg"
    }
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
            <h1 className="text-5xl mb-6">Our Partners</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-95">
              We're proud to collaborate with organizations that share our commitment to 
              empowering the next generation of women in technology. Together, we're creating 
              opportunities and building pathways to success in STEM fields.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {partners.map((partner, index) => {
              const colors = getColorClasses(partner.color);
              const Icon = partner.icon;
              
              return (
                <Card 
                  key={partner.id} 
                  className={`overflow-hidden hover:shadow-xl transition-shadow border-l-4 ${colors.border}`}
                >
                  <div className={`grid md:grid-cols-2 gap-8 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                    {/* Image */}
                    <div className={`relative h-64 md:h-auto ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                      <ImageWithFallback 
                        src={partner.image}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                    
                    {/* Content */}
                    <div className={`p-8 ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`bg-gradient-to-br ${colors.gradient} p-4 rounded-full flex-shrink-0`}>
                          <Icon className={`w-8 h-8 ${colors.text}`} />
                        </div>
                        <div>
                          <h2 className="text-3xl text-purple-900 mb-2">{partner.name}</h2>
                        </div>
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {partner.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-700 via-violet-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-6">Interested in Partnering?</h2>
          <p className="text-xl opacity-95 mb-8">
            We're always looking for organizations that share our vision of empowering women in technology. 
            If you're interested in collaborating with Divas in Tech, we'd love to hear from you.
          </p>
          <p className="text-lg opacity-90">
            Login to access our community and learn more about partnership opportunities.
          </p>
        </div>
      </section>
    </div>
  );
}