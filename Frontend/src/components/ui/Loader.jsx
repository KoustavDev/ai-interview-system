import Image from "next/image";

const Loader = () => (
  <div className="min-h-screen flex items-center justify-cen">
    <Image
      src="/loader.svg"
      alt="loader"
      width={24}
      height={24}
      className="animate-spin"
    />
  </div>
);

export default Loader;
