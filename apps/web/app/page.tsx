"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { useMutation, useQuery, Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@workspace/ui/components/button";


const Page = () => {
  return (
    <>
      <Authenticated>
        <Content />
      </Authenticated>
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-svh">
          <p>Please sign in to continue</p>
        </div>
      </Unauthenticated>
    </>
  );
};

const Content = () => {
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
};

export default Page;
