import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image src="/fordham-logo.png" alt="Fordham Rams" width={24} height={21} className="shrink-0" />
      RamHub
    </span>
  );
}
