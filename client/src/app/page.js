import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Shield, Zap, ArrowRight, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      
      {/* --- Navigation --- */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <Database className="h-4 w-4 text-white dark:text-black" />
          </div>
          Vector Vault
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Sign Up</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        
        {/* --- Hero Section --- */}
        <section className="py-24 md:py-32 px-6 text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            v1.0 is now live
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Secure Storage for your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
              Vector Embeddings
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The enterprise-grade vector database built for your next LLM application. 
            Store, index, and retrieve high-dimensional data with milliseconds latency 
            and military-grade encryption.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="h-12 px-8 text-base">
                Start Building Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Read Documentation
              </Button>
            </Link>
          </div>
        </section>

        {/* --- Features / Explanation Grid --- */}
        <section className="py-20 px-6 bg-zinc-100/50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-2">
              <h2 className="text-3xl font-bold">Why Vector Vault?</h2>
              <p className="text-zinc-500 dark:text-zinc-400">Everything you need to power your RAG pipelines.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <Zap className="h-10 w-10 text-amber-500 mb-2" />
                  <CardTitle>Lightning Fast</CardTitle>
                  <CardDescription>
                    Query millions of vectors in milliseconds using our proprietary HNSW indexing engine.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <Shield className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle>Secure by Default</CardTitle>
                  <CardDescription>
                    SOC2 compliant architecture with end-to-end encryption for data at rest and in transit.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <Lock className="h-10 w-10 text-green-500 mb-2" />
                  <CardTitle>Managed Access</CardTitle>
                  <CardDescription>
                    Granular API keys and role-based access control to keep your customer data isolated.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Bottom CTA --- */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to secure your data?</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Join thousands of developers building the next generation of AI applications.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="mt-4">
                Create Free Account
              </Button>
            </Link>
            <p className="text-xs text-zinc-500 pt-4">
              No credit card required for free tier.
            </p>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="py-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Vector Vault Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}