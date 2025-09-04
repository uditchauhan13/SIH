export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">Leading the Future of Environmental Monitoring</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              AirSight AI combines cutting-edge artificial intelligence with advanced satellite technology to provide
              the most accurate and comprehensive air quality monitoring solution available today.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our mission is to empower governments, organizations, and communities with real-time environmental data
              and predictive insights that enable proactive decision-making for a cleaner, healthier planet.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Monitoring</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="/modern-data-center-with-satellite-dishes-and-envir.jpg"
              alt="Environmental monitoring technology"
              className="w-full h-auto rounded-lg shadow-xl border border-border"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
