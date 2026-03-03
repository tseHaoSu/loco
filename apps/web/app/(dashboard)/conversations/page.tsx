"use client";

import Link from "next/link";

import {
  BookOpen,
  Palette,
  Mic,
  Code,
  Rocket,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent } from "@workspace/ui/components/card";

const STEPS = [
  {
    step: 1,
    title: "Add Knowledge",
    description: "Upload documents to train your AI assistant",
    icon: BookOpen,
    href: "/files",
  },
  {
    step: 2,
    title: "Voice Assistant",
    description: "Connect your Vapi plugin for voice support",
    icon: Mic,
    href: "/voice-assistant",
  },
  {
    step: 3,
    title: "Customize Widget",
    description: "Personalize your widget appearance",
    icon: Palette,
    href: "/customization",
  },
  {
    step: 4,
    title: "Preview & Test",
    description: "Test your embedded widget live",
    icon: Code,
    href: "/integrations",
  },
  {
    step: 5,
    title: "Deploy",
    description: "Add the widget to your website",
    icon: Rocket,
    href: "/integrations",
  },
];

const Conversations = () => {
  return (
    <div className="flex h-full w-full p-4 overflow-y-auto">
      <div className="w-full max-w-sm mx-auto my-auto">
        <div className="flex flex-col items-center">
          {STEPS.map((item, index) => (
            <div key={item.step} className="flex flex-col items-center w-full">
              <Link href={item.href} className="w-full">
                <Card className="transition-colors hover:bg-muted/50">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs text-muted-foreground mb-1">
                      Step {item.step}
                    </span>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
              {index < STEPS.length - 1 && (
                <div className="py-3">
                  <ArrowDown className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
