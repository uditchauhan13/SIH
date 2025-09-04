import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    quote:
      "AirSight AI has revolutionized how we monitor air quality in our city. The predictive analytics help us take proactive measures before pollution events occur.",
    author: "Dr. Sarah Chen",
    title: "Environmental Director, Metro City Council",
  },
  {
    quote:
      "The real-time satellite data and AI insights have been invaluable for our environmental research. The accuracy and detail are unmatched.",
    author: "Prof. Michael Rodriguez",
    title: "Climate Research Institute",
  },
  {
    quote:
      "Implementation was seamless, and the dashboard provides exactly the insights our team needs to make informed environmental policy decisions.",
    author: "Lisa Thompson",
    title: "Policy Analyst, State Environmental Agency",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Trusted by Environmental Leaders</h2>
          <p className="text-xl text-muted-foreground">See what our clients say about AirSight AI</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <blockquote className="text-card-foreground mb-4 leading-relaxed">"{testimonial.quote}"</blockquote>
                <div className="border-t border-border pt-4">
                  <div className="font-semibold text-card-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
