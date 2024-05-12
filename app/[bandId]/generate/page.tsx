"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { generate } from "./generate";
import { db } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";

export default function GeneratePage({
  params,
}: {
  params: { bandId: string };
}) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [setlist, setSetlist] = useState<{ title: string; key: string }[]>([]);
  return (
    <main className="p-8">
      <div className={cn("py-4")}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setGenerating(true);
            const repertoire = await db.songs
              .where("bandId")
              .equals(params.bandId)
              .toArray();
            const result = await generate({ prompt, repertoire });
            setSetlist(result.setlist);
            setGenerating(false);
          }}
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">
                Describe the setlist you wish to generate
              </Label>
              <Textarea
                id="title"
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Button disabled={!prompt} className="shrink-0" type="submit">
                Generate Setlist
              </Button>
            </div>
          </div>
        </form>
      </div>
      {generating && (
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </div>
      )}
      {setlist.length > 0 && !generating && (
        <div className={cn("py-4")}>
          <h2 className={cn("text-xl", "font-bold", "mb-4")}>Setlist</h2>
          <ul>
            {setlist.map((song) => (
              <li key={song.title}>
                {song.title} ({song.key})
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}