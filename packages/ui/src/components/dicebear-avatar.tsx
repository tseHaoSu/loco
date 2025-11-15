"use client";

import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface DicebearAvatarProps {
  seed?: string;
  name?: string;
  size?: number;
  className?: string;
}

export const DicebearAvatar = ({
  seed,
  name,
  size = 40,
  className,
}: DicebearAvatarProps) => {
  const avatarSvg = useMemo(() => {
    const avatar = createAvatar(initials, {
      seed: seed || name || "u",
    });
    return avatar.toDataUri();
  }, [seed, name]);

  const fallback = name ? name.slice(0, 2).toUpperCase() : "ME";

  return (
    <Avatar
      className={className}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <AvatarImage src={avatarSvg} alt={name || "Avatar"} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};
