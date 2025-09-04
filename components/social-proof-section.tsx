"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Rajesh Kumar",
    title: "Director, Central Pollution Control Board",
    organization: "Government of India",
    content:
      "AirSight AI has revolutionized our air quality monitoring capabilities. The 100m resolution data helps us make informed policy decisions for urban planning.",
    rating: 5,
    avatar: "/indian-government-official.jpg",
  },
  {
    name: "Sarah Chen",
    title: "Environmental Program Manager",
    organization: "World Health Organization",
    content:
      "The accuracy and real-time capabilities of AirSight AI are impressive. This technology is crucial for global environmental health monitoring.",
    rating: 5,
    avatar: "/who-environmental-expert.jpg",
  },
  {
    name: "Prof. Michael Thompson",
    title: "Climate Research Lead",
    organization: "NASA Goddard Space Flight Center",
    content:
      "AirSight AI's integration of satellite data with AI processing represents a significant advancement in atmospheric monitoring technology.",
    rating: 5,
    avatar: "/nasa-climate-scientist.jpg",
  },
  {
    name: "Dr. Priya Sharma",
    title: "Air Quality Specialist",
    organization: "Indian Institute of Technology",
    content:
      "The hyperlocal resolution and predictive capabilities make AirSight AI an invaluable tool for our environmental research projects.",
    rating: 5,
    avatar: "/iit-environmental-researcher.jpg",
  },
]

const organizations = [
  { name: "NASA", logo: "/nasa-logo.jpg" },
  { name: "WHO", logo: "/who-logo.jpg" },
  { name: "CPCB", logo: "/cpcb-india-logo.jpg" },
  { name: "IIT", logo: "/iit-logo.jpg" },
  { name: "ISRO", logo: "/isro-logo.jpg" },
  { name: "EPA", logo: "/epa-logo.jpg" },
]

export function SocialProofSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
            Trusted by Leading Organizations
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-slate-300 max-w-3xl mx-auto text-pretty">
            Environmental agencies and research institutions worldwide rely on AirSight AI
          </motion.p>
        </motion.div>

        {/* Organization Logos */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex flex-wrap justify-center items-center gap-8 mb-16 opacity-60"
        >
          {organizations.map((org, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img src={org.logo || "/placeholder.svg"} alt={org.name} className="h-10 w-auto" />
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-slate-800/50 border-slate-700 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Quote className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-slate-300 leading-relaxed mb-4">{testimonial.content}</p>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-slate-400">{testimonial.title}</p>
                      <p className="text-sm text-cyan-400">{testimonial.organization}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
