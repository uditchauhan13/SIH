"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

const faqData = [
  {
    question: "How accurate is AirSight AI compared to ground-based monitoring?",
    answer:
      "AirSight AI achieves 94% accuracy compared to ground truth measurements, significantly outperforming traditional satellite-only methods (72% accuracy). Our AI-enhanced processing combines multiple data sources and advanced algorithms to provide near ground-station quality measurements.",
  },
  {
    question: "What is the spatial resolution of your air quality data?",
    answer:
      "We provide air quality data at 100-meter grid resolution, a 100x improvement over traditional 10km satellite data. This high resolution allows for hyperlocal air quality monitoring, perfect for urban planning and environmental health assessments.",
  },
  {
    question: "How often is the air quality data updated?",
    answer:
      "Our system provides real-time updates every 15 minutes during daylight hours when satellite passes occur. We also offer historical data analysis and 7-day forecasting capabilities using our predictive AI models.",
  },
  {
    question: "Which pollutants can AirSight AI monitor?",
    answer:
      "We monitor all major air pollutants including PM2.5, PM10, NO2, SO2, CO, and O3. Our AI models are trained to detect and quantify these pollutants from satellite spectral data with high precision.",
  },
  {
    question: "Is AirSight AI suitable for regulatory compliance monitoring?",
    answer:
      "Yes, our data meets international standards for environmental monitoring and is being validated with regulatory agencies. We provide detailed audit trails and uncertainty quantification for compliance reporting.",
  },
  {
    question: "How does the pricing work for different coverage areas?",
    answer:
      "We offer flexible pricing based on coverage area and update frequency. Contact our team for custom quotes for cities, regions, or countries. We also provide free access for academic research and environmental NGOs.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24 bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">Frequently Asked Questions</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto text-pretty">
            Get answers to common questions about AirSight AI's capabilities and implementation
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <motion.button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                  whileHover={{ backgroundColor: "rgba(51, 65, 85, 0.3)" }}
                >
                  <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                  <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="px-6 pb-6 pt-0">
                        <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
