import { CustomerMenuInterface } from '@/components/customer/screen/CustomerMenuInterface';

interface PageProps {
  params: Promise<{
    branchSlug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { branchSlug } = await params;

  return <CustomerMenuInterface branchSlug={branchSlug} />;
}