import { Briefcase, Star, MapPin, Award, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const skills = ["React", "TypeScript", "Node.js", "UI/UX Design", "Project Management", "Python"];

const experience = [
  {
    role: "Senior Software Engineer",
    company: "TechCorp Inc.",
    period: "2022 - Present",
    description: "Leading frontend architecture and mentoring junior developers.",
  },
  {
    role: "Full Stack Developer",
    company: "StartupXYZ",
    period: "2020 - 2022",
    description: "Built scalable web applications serving 100K+ users.",
  },
];

const portfolio = [
  { title: "E-Commerce Platform", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop", category: "Web App" },
  { title: "Health & Fitness App", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop", category: "Mobile" },
  { title: "Dashboard Analytics", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop", category: "Web App" },
  { title: "Social Media Tool", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop", category: "SaaS" },
];

const services = [
  { title: "Web Development", rate: "$80/hr", description: "Full-stack web application development", icon: Briefcase },
  { title: "UI/UX Consulting", rate: "$60/hr", description: "Design review and user experience optimization", icon: Star },
  { title: "Technical Mentoring", rate: "$50/hr", description: "1-on-1 coaching for developers", icon: Users },
];

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } }),
};

export default function WorkProfile() {
  return (
    <div className="space-y-5">
      {/* Professional Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Professional Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Passionate software engineer with 5+ years of experience building modern web applications.
            Specialized in React ecosystem and scalable architecture. Open to freelance projects and collaborations.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              San Francisco, CA
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Available for hire
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Top Rated
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <motion.div key={skill} custom={i} initial="hidden" animate="visible" variants={itemVariants}>
                <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1">{skill}</Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <service.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium text-foreground truncate">{service.title}</h4>
                  <span className="text-xs font-semibold text-primary shrink-0">{service.rate}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {experience.map((exp, i) => (
            <motion.div
              key={exp.role}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="relative pl-4 border-l-2 border-primary/30"
            >
              <h4 className="text-sm font-semibold text-foreground">{exp.role}</h4>
              <p className="text-xs text-primary font-medium">{exp.company}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{exp.period}</p>
              <p className="text-xs text-muted-foreground mt-1">{exp.description}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {portfolio.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
              >
                <img src={item.image} alt={item.title} className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 sm:p-3">
                  <h4 className="text-xs sm:text-sm font-medium text-primary-foreground">{item.title}</h4>
                  <span className="text-[10px] sm:text-xs text-primary-foreground/80">{item.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hire Button */}
      <div className="pb-4">
        <Button className="w-full h-11 text-sm font-semibold gap-2">
          <Briefcase className="w-4 h-4" />
          Hire Me
        </Button>
      </div>
    </div>
  );
}
