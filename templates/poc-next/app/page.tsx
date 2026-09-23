import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="IRFP POC"
        description="Replace this screen with the approved task plan and RFP UI specs. Retokenize :root from UI direction."
      />
      <Card>
        <p className="text-sm text-muted">
          Data is local and fake. Do not add clickable http or https links.
        </p>
      </Card>
    </>
  );
}
