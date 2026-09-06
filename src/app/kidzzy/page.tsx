import Image from "next/image";
import Link from "next/link";
import { fetchKidzzyProducts } from "@/lib/kidzzy";
import KidzzyProductCard from "@/components/kidzzy/KidzzyProductCard";

export const dynamic = "force-dynamic";

export default async function KidzzyHomePage() {
  let items: Awaited<ReturnType<typeof fetchKidzzyProducts>>["items"] = [];
  try {
    const data = await fetchKidzzyProducts({ type: "printable" });
    items = data.items.slice(0, 4);
  } catch {
    items = [];
  }

  return (
    <>
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 md:block">
        <div className="pointer-events-none absolute -right-10 top-8 text-7xl opacity-30">🚀</div>
        <div className="pointer-events-none absolute bottom-6 left-[12%] text-5xl opacity-25">✏️</div>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Kids by azdeploy.com</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              Fun Learning for a Brighter Future
            </h1>
            <p className="mt-4 max-w-lg text-base text-slate-600 sm:text-lg">
              Printable coloring books, handwriting sheets, and activity packs — ready to download after payment.
            </p>
            <Link
              href="/kidzzy/printables"
              className="mt-7 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
            >
              Explore Products
            </Link>
          </div>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-lg shadow-slate-900/10">
            <Image
              src="/kidzzy/hero-child.jpg"
              alt="Child coloring a printable worksheet"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 28rem, 28rem"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto hidden max-w-6xl px-4 py-12 sm:px-6 md:block">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/kidzzy/printables"
            className="flex items-center justify-between rounded-3xl bg-amber-100 p-6 transition hover:bg-amber-200/80"
          >
            <div>
              <p className="text-xl font-black text-slate-900">Printables</p>
              <p className="mt-1 text-sm text-slate-600">Coloring, tracing, worksheets — ₹199 / ₹299</p>
            </div>
            <span className="text-4xl">📒</span>
          </Link>
          <div className="flex items-center justify-between rounded-3xl bg-violet-100 p-6 opacity-80">
            <div>
              <p className="text-xl font-black text-slate-900">Storybooks</p>
              <p className="mt-1 text-sm text-slate-600">Coming soon</p>
            </div>
            <span className="text-4xl">📚</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:pb-16 md:pt-0">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Featured printables</h2>
            <p className="mt-1 text-sm text-slate-500">Instant PDF download after Razorpay payment</p>
          </div>
          <Link href="/kidzzy/printables" className="text-sm font-bold text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        {items.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {items.map((p) => (
              <KidzzyProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
            Products will appear here after the Kidzzy migration is applied.
          </p>
        )}
      </section>
    </>
  );
}
