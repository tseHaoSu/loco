import ConversationIdLayout from "@/modules/dashboard/layouts/ConversationIdLayout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <ConversationIdLayout>{children}</ConversationIdLayout>;
}
