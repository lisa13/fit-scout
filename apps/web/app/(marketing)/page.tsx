import Link from "next/link"
import { Container } from "@/components/shell/Container"
import { Button } from "@/components/ui/button"
import { Search, Ruler, Shield, Zap, Target } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground mb-6">
              <Shield className="h-4 w-4 mr-2" />
              Open Source
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Shop smarter.
              <span className="text-primary block">Fit perfectly.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              AI-powered size recommendations that take the guesswork out of online shopping. 
              Get personalized fit suggestions based on your measurements and preferences.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="btn-primary">
                <Link href="/find">
                  <Search className="h-5 w-5 mr-2" />
                  Find Similar Products
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/fit">
                  <Ruler className="h-5 w-5 mr-2" />
                  Get Size Recommendations
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Similar</h3>
              <p className="text-muted-foreground">
                Upload a product image or paste a URL to find similar items with perfect fit
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Size Suggestor</h3>
              <p className="text-muted-foreground">
                AI analyzes your measurements and provides accurate size recommendations
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Private by Default</h3>
              <p className="text-muted-foreground">
                Your measurements and preferences stay on your device. No tracking, no ads.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get personalized size recommendations in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Input Your Measurements</h3>
              <p className="text-muted-foreground">
                Enter your body measurements and fit preferences
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI processes your data and brand size charts
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Recommendations</h3>
              <p className="text-muted-foreground">
                Receive personalized size and product suggestions
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Strip */}
      <section className="py-20 bg-primary text-primary-foreground">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to find your perfect fit?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have found their ideal sizes with FitScout
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/find">Start Finding Products</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/fit">Get Size Recommendations</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}