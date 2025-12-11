"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@workspace/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";

const screenshots = [
  {
    src: "/screenshots/embedd.png",
    alt: "Embed widget screenshot",
    caption: "Seamlessly embed AI chat widgets into any website",
  },
  {
    src: "/screenshots/customization.png",
    alt: "Customization screenshot",
    caption: "Customize your widget appearance to match your brand",
  },
  {
    src: "/screenshots/knowledge.png",
    alt: "Knowledge base screenshot",
    caption: "Build intelligent knowledge bases for accurate responses",
  },
  {
    src: "/screenshots/plugin.png",
    alt: "Plugin screenshot",
    caption: "Extend functionality with powerful plugins",
  },
  {
    src: "/screenshots/voice-call.png",
    alt: "Voice call screenshot",
    caption: "Enable voice conversations for natural interactions",
  },
];

export const ScreenshotsSection = () => {
  return (
    <section className="relative z-40 px-6 py-32 max-w-7xl mx-auto">
      <motion.div
        className="text-center space-y-4 mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          See Loco in Action
        </motion.h2>
        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore the powerful features that make Loco the ultimate customer
          support platform
        </motion.p>
      </motion.div>

      <div className="w-full max-w-5xl mx-auto px-12">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {screenshots.map((screenshot, index) => (
              <CarouselItem key={index}>
                <Card className="p-4 bg-card/50 backdrop-blur-sm border-border">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                    <Image
                      src={screenshot.src}
                      alt={screenshot.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 1024px"
                    />
                  </div>
                  <p className="text-muted-foreground text-center">
                    {screenshot.caption}
                  </p>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-card/80 backdrop-blur-sm border-border hover:bg-card" />
          <CarouselNext className="bg-card/80 backdrop-blur-sm border-border hover:bg-card" />
        </Carousel>
      </div>
    </section>
  );
};
