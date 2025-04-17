import { Badge } from "@/components/ui/Badge";

interface MarathonRecordProps {
  recordHolder: string;
  recordYear: number;
  courseRecord: string;
}

export function MarathonRecord({ recordHolder, recordYear, courseRecord }: MarathonRecordProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Badge variant="outline">Course Record</Badge>
      <span>
        {courseRecord} by {recordHolder} ({recordYear})
      </span>
    </div>
  );
} 