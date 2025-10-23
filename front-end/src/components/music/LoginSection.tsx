"use client";

import { signIn } from "next-auth/react";
import { LogIn, Music, Heart, Download, Users, Sparkles, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function LoginSection() {
  const handleLogin = async () => {
    await signIn("auth0");
  };

  const benefits = [
    {
      icon: Heart,
      title: "Create Playlists",
      description: "Build your perfect music collection and organize your favorite tracks",
    },
    {
      icon: Download,
      title: "Download & Listen Offline",
      description: "Take your music anywhere, even without internet connection",
    },
    {
      icon: Radio,
      title: "Personalized Radio",
      description: "Discover new music tailored to your unique taste",
    },
    {
      icon: Users,
      title: "Social Features",
      description: "Share playlists and see what your friends are listening to",
    },
    {
      icon: Sparkles,
      title: "Ad-Free Experience",
      description: "Enjoy uninterrupted music streaming without any ads",
    },
    {
      icon: Music,
      title: "High Quality Audio",
      description: "Experience crystal clear sound with premium audio quality",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-8 md:p-12 text-primary-foreground">
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-foreground/20 mb-6 backdrop-blur-sm">
            <Music className="w-10 h-10" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Start Your Music Journey
          </h2>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Sign in to unlock unlimited music streaming, create playlists, and discover new artists tailored just for you.
          </p>
          <Button
            onClick={handleLogin}
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-200"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In with Auth0
          </Button>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="group bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-primary-foreground/80">
                    {benefit.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-4 delay-700">
          <p className="text-sm text-primary-foreground/70 mb-4">
            Join millions of music lovers worldwide
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-foreground/50" />
              <span className="text-primary-foreground/80">Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-foreground/50" />
              <span className="text-primary-foreground/80">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-foreground/50" />
              <span className="text-primary-foreground/80">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-foreground/5 rounded-full blur-3xl" />
    </section>
  );
}
