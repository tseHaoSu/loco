import { Card, CardContent } from "@workspace/ui/components/card";

const INSTRUCTIONS = [
  "Upload PDF, Word, or text files for your AI to reference.",
  "The AI searches your documents to answer customer questions.",
  "Keep files updated for accurate responses.",
];

export const InstructionsCard = () => (
  <Card>
    <CardContent>
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
    </CardContent>
  </Card>
);
