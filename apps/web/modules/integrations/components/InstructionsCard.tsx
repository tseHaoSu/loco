import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

interface Instruction {
  text: string;
  href?: string;
  linkText?: string;
}

interface Section {
  title: string;
  instructions: Instruction[];
}

const SECTIONS: Section[] = [
  {
    title: "Getting Started",
    instructions: [
      {
        text: "Go to {Knowledge Base} and upload files for the AI to read and understand. Drag and drop any file type.",
        href: "/files",
        linkText: "Knowledge Base",
      },
      {
        text: "Go to {Widget Customization} to set the initial greeting message and suggested prompts.",
        href: "/customization",
        linkText: "Widget Customization",
      },
      {
        text: "Copy the embed code below and paste it into your website before the closing </body> tag.",
      },
    ],
  },
  {
    title: "For Your Customers",
    instructions: [
      { text: "Customers enter their name and email to start a session. Sessions expire after 24 hours." },
      { text: "Each session can create multiple conversations to resolve different issues." },
      { text: "Customers can request a human agent at any time for escalation." },
      { text: "Customers can start a voice call with the AI agent if enabled." },
    ],
  },
  {
    title: "Dashboard",
    instructions: [
      { text: "View all conversations for your organization in the Conversations dashboard." },
      { text: "Interrupt the AI agent at any time to speak directly with customers." },
      { text: "Conversations close automatically once issues are resolved." },
      { text: "Configure the AI voice agent in the Voice Assistant section." },
    ],
  },
];

export const InstructionsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>How It Works</CardTitle>
      <CardDescription>
        Set up your AI assistant and manage customer conversations.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {SECTIONS.map((section) => (
        <div key={section.title} className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            {section.title}
          </h3>
          <ol className="space-y-2">
            {section.instructions.map((instruction, index) => (
              <li
                key={index}
                className="flex gap-3 text-sm text-muted-foreground"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {index + 1}
                </span>
                <span>
                  {instruction.href && instruction.linkText
                    ? instruction.text.split(`{${instruction.linkText}}`).map((part, i, arr) =>
                        i < arr.length - 1 ? (
                          <span key={i}>
                            {part}
                            <Link
                              href={instruction.href!}
                              className="text-primary underline-offset-4 hover:underline"
                            >
                              {instruction.linkText}
                            </Link>
                          </span>
                        ) : (
                          part
                        )
                      )
                    : instruction.text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </CardContent>
  </Card>
);
