import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { CLUB_ANTHEM_YOUTUBE_ID } from "@/lib/social";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Himno" };

export default function HimnoPage() {
  return (
    <Section title="Himno del club">
      <Card className="overflow-hidden p-0">
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${CLUB_ANTHEM_YOUTUBE_ID}`}
            title="Himno del Club Social y Deportivo Algarrobo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="p-6 text-primary/70">
          Video clip grabado en nuestra institución con la canción del club. Próximamente
          agregaremos aquí la historia, autor y año de composición del himno oficial.
        </p>
      </Card>
    </Section>
  );
}
