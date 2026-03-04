import DocSlideshow from "@/components/DocSlideshow";

export const metadata = {
  title: "Python Doc",
  description: "Protected learning material.",
  robots: "noindex, nofollow",
};

export default function PythonDocPage() {
  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <DocSlideshow />
    </div>
  );
}
