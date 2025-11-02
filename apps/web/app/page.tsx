"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div>
        <p>apps/web</p>
        <Button onClick={() => addUser()}>Add User</Button>
        <p>{JSON.stringify(users)}</p>
      </div>
    </div>
  );
}
