"use client";

import { UserButton } from "@clerk/nextjs";
import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";

const Page = () => {
  const users = useQuery(api.public.users.getMany);
  const addUser = useMutation(api.public.users.add);
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <UserButton />
          </div>

          <div className="flex flex-col gap-4">
            <Button onClick={() => addUser()} className="w-full sm:w-auto">
              Add User
            </Button>

            <div className="rounded-lg border p-4 bg-card">
              <h2 className="text-lg font-semibold mb-2">Users</h2>
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(users, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
