import { ArrowRight, KeyRound } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SetupRequired({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Badge variant="warning" className="w-fit">
            <KeyRound className="size-3" aria-hidden="true" />
            Configuration required
          </Badge>
          <CardTitle className="mt-3 font-serif text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
            Add the Clerk publishable and secret keys to <code>.env.local</code>,
            then restart the development server. Never paste keys into chat or
            commit them.
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/setup" className={buttonVariants()}>
              Open setup status
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/"
              className={buttonVariants({ variant: "outline" })}
            >
              Back home
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
