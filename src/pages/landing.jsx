import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="flex flex-col items-center justify-center w-full py-10 sm:py-20">
      {/* Container to center everything */}
      <div className="w-full max-w-7xl mx-auto px-4 flex flex-col gap-10 sm:gap-20">

        {/* ── Hero Section ── */}
        <section className="text-center pt-4 sm:pt-8">
          {/* Pill label above headline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-secondary/40 text-muted-foreground text-xs sm:text-sm mb-6 backdrop-blur-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Thousands of jobs updated daily
          </div>

          <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-4xl sm:text-6xl lg:text-8xl tracking-tighter py-4 leading-tight">
            Find Your Dream Job
            <span className="flex items-center gap-2 sm:gap-6 mt-1">
              and you can be
              <img
                src="/logoo.png"
                className="h-14 sm:h-24 lg:h-20 drop-shadow-lg"
                alt="nextHire Logo"
              />
            </span>
          </h1>

          <p className="text-muted-foreground mt-4 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed">
            Explore thousands of job listings or find the perfect candidate — all in one place.
          </p>
        </section>

        {/* ── CTA Buttons ── */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to={"/jobs"}>
            <Button variant="blue" size="xl" className="shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-shadow">
              Find Jobs
            </Button>
          </Link>
          <Link to={"/post-job"}>
            <Button variant="destructive" size="xl" className="shadow-lg shadow-destructive/20 hover:shadow-destructive/30 transition-shadow">
              Post a Job
            </Button>
          </Link>
        </div>

        {/* ── Trusted-by companies carousel ── */}
        <div className="w-full">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground/60 mb-6 font-medium">
            Trusted by top companies
          </p>
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full"
          >
            <CarouselContent className="flex gap-5 sm:gap-20 items-center">
              {companies.map(({ name, id, path }) => (
                <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                  <img
                    src={path}
                    alt={name}
                    className="h-9 sm:h-14 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* ── Banner Image ── */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img src="/bg.jpg" className="w-full object-cover" alt="Banner" />
          {/* Subtle gradient overlay on banner */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none rounded-2xl" />
        </div>

        {/* ── Feature Cards ── */}
        <section>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-foreground/90 mb-6 tracking-tight">
            Built for everyone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hover lift effect on both cards */}
            <Card className="hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/30 cursor-default">
              <CardHeader>
                <CardTitle className="font-bold text-lg">For Job Seekers</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                Search and apply for jobs, track your applications, and get hired faster.
              </CardContent>
            </Card>
            <Card className="hover:-translate-y-1 hover:shadow-xl hover:border-destructive/30 cursor-default">
              <CardHeader>
                <CardTitle className="font-bold text-lg">For Employers</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                Post jobs, review applications, manage candidates, and grow your team.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-foreground/90 mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <Accordion type="multiple" className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

      </div>
    </main>
  );
};

export default LandingPage;
