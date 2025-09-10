import Link from "next/link";
import { Container } from "@/components/shell/Container";
import { Button } from "@/components/ui/button";
import { Search, Ruler, Shield, Zap, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground">
              <Shield className="mr-2 h-4 w-4" />
              Open Source
            </div>
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Shop smarter.
              <span className="block text-primary">Fit perfectly.</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
              AI-powered size recommendations that take the guesswork out of
              online shopping. Get personalized fit suggestions based on your
              measurements and preferences.
            </p>

            {/* CTA Buttons */}
            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="btn-primary">
                <Link href="/find">
                  <Search className="mr-2 h-5 w-5" />
                  Find Similar Products
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/fit">
                  <Ruler className="mr-2 h-5 w-5" />
                  Get Size Recommendations
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Find Similar</h3>
              <p className="text-muted-foreground">
                Upload a product image or paste a URL to find similar items with
                perfect fit
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Size Suggestor</h3>
              <p className="text-muted-foreground">
                AI analyzes your measurements and provides accurate size
                recommendations
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Private by Default</h3>
              <p className="text-muted-foreground">
                Your measurements and preferences stay on your device. No
                tracking, no ads.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <Container>
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Get personalized size recommendations in three simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                Input Your Measurements
              </h3>
              <p className="text-muted-foreground">
                Enter your body measurements and fit preferences
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI processes your data and brand size charts
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                Get Recommendations
              </h3>
              <p className="text-muted-foreground">
                Receive personalized size and product suggestions
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Strip */}
      <section className="bg-primary py-20 text-primary-foreground">
        <Container>
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to find your perfect fit?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/80">
              Join thousands of users who have found their ideal sizes with
              FitScout
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild variant="secondary" size="lg">
                <Link href="/find">Start Finding Products</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/fit">Get Size Recommendations</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
