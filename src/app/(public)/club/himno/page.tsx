import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Himno" };

export default function HimnoPage() {
  return (
    <Section title="Himno del club">
      <Card className="p-8">
        <p className="text-primary/70">
          El himno oficial del Club Social y Deportivo Algarrobo se publicará en esta sección
          junto con su historia, autor y año de composición.
        </p>
      </Card>
    </Section>
  );
}
