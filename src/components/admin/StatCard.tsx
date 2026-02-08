import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconClassName?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  iconClassName,
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center",
            iconClassName || "bg-primary/10"
          )}
        >
          <Icon className={cn("h-5 w-5", iconClassName ? "text-current" : "text-primary")} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p
            className={cn(
              "text-xs mt-1 font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}% dari bulan lalu
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
