import Image from "next/image";

export function LoginLogo() {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Logo container — KMITL deep orange/navy gradient keeps logo visible on all themes */}
      <div
        className="
          w-full rounded-xl
          bg-gradient-to-br from-[#F2651A] via-[#D4561A] to-[#A83E10]
          px-6 py-5
          flex items-center justify-center
          shadow-md shadow-[#F2651A]/40
          ring-1 ring-[#FF8C42]/50
        "
      >
        <Image
          src="https://iam.science.kmitl.ac.th/_app/immutable/assets/sci-kmitl-logo.64kyxinc.avif"
          alt="School of Science KMITL"
          width={180}
          height={60}
          className="object-contain drop-shadow-sm"
          unoptimized
          priority
        />
      </div>
    </div>
  );
}
