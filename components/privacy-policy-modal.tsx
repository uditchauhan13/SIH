"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Shield, Eye, Database, Cookie, Mail } from "lucide-react"

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh]"
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-cyan-400" />
                  Privacy Policy
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-6 text-slate-300">
                    <div>
                      <p className="text-sm text-slate-400 mb-4">Last updated: January 2024</p>
                      <p className="leading-relaxed">
                        At AirSight AI, we are committed to protecting your privacy and ensuring the security of your
                        personal information. This Privacy Policy explains how we collect, use, and safeguard your data
                        when you use our air quality monitoring platform.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Database className="w-5 h-5 text-cyan-400" />
                        Information We Collect
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-white mb-2">Personal Information</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Name, email address, and contact information</li>
                            <li>Organization details and professional information</li>
                            <li>Account credentials and preferences</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-2">Usage Data</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Platform usage patterns and feature interactions</li>
                            <li>API usage statistics and performance metrics</li>
                            <li>Device information and browser details</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-cyan-400" />
                        How We Use Your Information
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Provide and maintain our air quality monitoring services</li>
                        <li>Process your requests and provide customer support</li>
                        <li>Improve our platform and develop new features</li>
                        <li>Send important updates and service notifications</li>
                        <li>Comply with legal obligations and protect our rights</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Cookie className="w-5 h-5 text-cyan-400" />
                        Cookies and Tracking
                      </h3>
                      <div className="space-y-3 text-sm">
                        <p>We use cookies and similar technologies to:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>
                            <strong>Necessary Cookies:</strong> Essential for platform functionality and security
                          </li>
                          <li>
                            <strong>Analytics Cookies:</strong> Help us understand usage patterns and improve our
                            services
                          </li>
                          <li>
                            <strong>Preference Cookies:</strong> Remember your settings and personalize your experience
                          </li>
                        </ul>
                        <p>You can manage your cookie preferences through our cookie consent banner.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Data Security</h3>
                      <p className="text-sm leading-relaxed">
                        We implement industry-standard security measures to protect your data, including encryption,
                        secure data transmission, regular security audits, and access controls. However, no method of
                        transmission over the internet is 100% secure.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Data Sharing</h3>
                      <p className="text-sm leading-relaxed">
                        We do not sell, trade, or rent your personal information to third parties. We may share your
                        data only in the following circumstances: with your explicit consent, to comply with legal
                        obligations, to protect our rights and safety, or with trusted service providers under strict
                        confidentiality agreements.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Your Rights</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Access and review your personal information</li>
                        <li>Request corrections to inaccurate data</li>
                        <li>Request deletion of your personal information</li>
                        <li>Object to or restrict certain data processing</li>
                        <li>Data portability for your information</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-cyan-400" />
                        Contact Us
                      </h3>
                      <p className="text-sm leading-relaxed">
                        If you have any questions about this Privacy Policy or our data practices, please contact us at:
                      </p>
                      <div className="mt-2 text-sm">
                        <p>Email: privacy@airsight.ai</p>
                        <p>Address: IIT Delhi Research Park, New Delhi, India 110016</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <div className="flex justify-end mt-6">
                  <Button onClick={onClose} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    I Understand
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function PrivacyPolicyTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-slate-400 hover:text-cyan-400 transition-colors text-sm underline"
      >
        Privacy Policy
      </button>
      <PrivacyPolicyModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
