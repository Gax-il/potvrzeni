import logoUrl from "@/assets/logo-4camps.svg";

interface LogoMarkProps {
  height?: number;
  className?: string;
}

export function LogoMark({ height = 28, className }: LogoMarkProps) {
  return (
    <img
      src={logoUrl}
      alt="4Camps"
      height={height}
      style={{ height, width: "auto" }}
      className={className}
    />
  );
}
