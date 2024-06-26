"use client";

import { DataTable } from "@/components/layout/DataTable";
import { Song, db } from "@/lib/db";
import { ColumnDef } from "@tanstack/react-table";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { EditSongSheet } from "./EditSongSheet";
import { mixpanel } from "@/lib/mixpanel";

const columns: ColumnDef<Song>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "key",
    header: "Key",
  },
];

export function SongList({ bandId }: { bandId: string }) {
  const songs =
    useLiveQuery(() => db.songs.where("bandId").equals(bandId).toArray()) ?? [];
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  return (
    <>
      {selectedSong && (
        <EditSongSheet
          song={selectedSong}
          onRequestClose={() => setSelectedSong(null)}
        />
      )}
      <DataTable
        columns={columns}
        data={songs}
        onRowClick={(song) => {
          setSelectedSong(song);
          mixpanel.track("Edit Song Clicked", { bandId, songId: song.id });
        }}
      />
    </>
  );
}
