import { Download } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

const INSTRUCTIONS = [
  "Upload PDF, Word, or text files for your AI to reference.",
  "The AI searches your documents to answer customer questions.",
  "Keep files updated for accurate responses.",
];

const EXAMPLE_FILES = [
  { name: "FAQ", file: "faq.txt" },
  { name: "Pricing", file: "pricing-plans.txt" },
  { name: "Invoice", file: "billing-invoice-example.txt" },
];

export const InstructionsCard = () => (
  <Card>
    <CardContent className="space-y-4">
      <ol className="space-y-2">
        {INSTRUCTIONS.map((instruction, index) => (
          <li
            key={index}
            className="flex gap-3 text-sm text-muted-foreground"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {index + 1}
            </span>
            <span>{instruction}</span>
          </li>
        ))}
      </ol>

      <div className="border-t pt-4">
        <p className="text-xs text-muted-foreground mb-2">
          Download example files to get started:
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_FILES.map((example) => (
            <Button
              key={example.file}
              variant="outline"
              size="sm"
              asChild
            >
              <a href={`/examples/${example.file}`} download>
                <Download className="h-3 w-3 mr-1" />
                {example.name}
              </a>
            </Button>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);
