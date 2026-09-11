import {
  Atom,
  BookOpen,
  Brain,
  BrainCircuit,
  Calculator,
  Car,
  ChefHat,
  ChessKnight,
  Code2,
  Cpu,
  Drum,
  Dumbbell,
  FlaskConical,
  Flower2,
  Gavel,
  Guitar,
  HandFist,
  Languages,
  Leaf,
  Mic,
  Music,
  Music2,
  Music3,
  Music4,
  Palette,
  Piano,
  CircleDot,
  Scissors,
  Smartphone,
  Theater,
  Volleyball,
  Waves,
  type LucideIcon,
} from "lucide-react";

const SUBJECT_ICONS: Record<string, LucideIcon | string> = {
  Math: Calculator,
  Anglais: Languages,
  Piano,
  "Coach sportif": Dumbbell,
  Français: Languages,
  Chant: Mic,
  "Soutien scolaire": BookOpen,
  Guitare: Guitar,
  Natation: Waves,
  "Aide aux devoirs": BookOpen,
  Tennis: "/subjects/tennis.svg",
  Espagnol: Languages,
  Arabe: Languages,
  Physique: Atom,
  Chimie: FlaskConical,
  Japonais: Languages,
  Conduite: Car,
  Dessin: Palette,
  Italien: Languages,
  Violon: "/subjects/violin.svg",
  Chinois: Languages,
  Danse: Music,
  Batterie: Drum,
  Echecs: ChessKnight,
  Yoga: Flower2,
  "Boxe anglaise": HandFist,
  Coreen: Languages,
  Couture: Scissors,
  Russe: Languages,
  Philosophe: Brain,
  SVT: Leaf,
  Droit: Gavel,
  Musculation: Dumbbell,
  Football: "/subjects/football.svg",
  Saxophone: Music3,
  Basse: Guitar,
  Violoncelle: Music4,
  Informatique: Cpu,
  Cuisine: ChefHat,
  Pilates: Flower2,
  Padel: Volleyball,
  Théatre: Theater,
  Musique: Music,
  "Intelligence artificielle": BrainCircuit,
  "Application mobile": Smartphone,
  Wordpress: "/subjects/wordpress.svg",
  Nextjs: "/subjects/nextjs.svg",
};

export function SubjectIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const icon = SUBJECT_ICONS[name] ?? BookOpen;

  if (typeof icon === "string") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={icon} alt="" className={className} />;
  }

  const Icon = icon;
  return <Icon className={className} />;
}
