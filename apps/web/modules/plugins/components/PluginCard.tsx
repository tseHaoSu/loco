import { ArrowLeftRight, LucideIcon, Plug } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "@workspace/ui/components/button";

export interface Feature {
  icon: LucideIcon;
  label: string;
  description: string;
}

interface PluginCardProps {
  isDisabled?: boolean;
  serviceName: string;
  serviceImage: string;
  features: Feature[];
  onSubmit: () => void;
}

export const PluginCard = ({
  isDisabled,
  serviceName,
  serviceImage,
  features,
  onSubmit,
}: PluginCardProps) => {
  return (
    <div className="h-fit w-full rounded-lg border p-8 bg-background">
      <div className="mb-6 flex items-center justify-center gap-6">
        <Image src={serviceImage} alt={serviceName} width={40} height={40} />
        <div className="flex flex-col items-center">
          <ArrowLeftRight />
        </div>
        <Image
          src="/user.png"
          alt="Platform"
          width={40}
          height={40}
          className="dark:invert"
        />
      </div>

      <div className="mb-4 text-center">
        <p className="text-lg font-semibold">
          Connect your {serviceName} account
        </p>
      </div>

      <div className="space-y-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.label} className="flex items-start gap-3">
              <Icon className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{feature.label}</p>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <Button onClick={onSubmit} disabled={isDisabled} className="w-full">
          <Plug className="mr-2 h-4 w-4" />
          Connect {serviceName}
        </Button>
      </div>
    </div>
  );
};
