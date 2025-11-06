import { WidgetView } from "@/modules/ui/views/WidgetView";

interface Props {
  searchParams: Promise<{
    organizationId: string;
  }>;
}

const Page = async ({ searchParams }: Props) => {
  const { organizationId } = await searchParams;
  return <WidgetView organizationId={organizationId} />;
};

export default Page;
