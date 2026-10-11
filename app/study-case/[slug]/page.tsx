import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy, CaseStudy } from "@/data/case-studies";

// Next.js 15+: `params` adalah Promise. Di Next.js 14, hapus `await` dan
// ubah tipenya menjadi `{ params: { slug: string } }`.
type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((c:CaseStudy) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: `Studi kasus: ${study.name}`,
    description: study.summary,
    openGraph: {
      title: `Studi kasus: ${study.name}`,
      description: study.summary,
      images: [study.image],
    },
  };
}

export default async function StudyCasePage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <main className="min-h-screen bg-[#F4F6F8] font-sans text-neutral-900 antialiased">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/#karya"
          className="inline-flex text-sm font-medium text-neutral-600 no-underline hover:text-neutral-900"
        >
          Kembali ke karya lainnya
        </Link>

        {/* Hero */}
        <header
          style={{ backgroundColor: study.color }}
          className="mt-6 grid gap-8 overflow-hidden rounded-3xl p-6 sm:p-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center"
        >
          <div className="flex flex-col items-start gap-5">
            <p className="m-0 text-sm font-medium text-black/60">
              Studi kasus · {study.category}
            </p>
            <h1 className="m-0 text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl">
              {study.name}
            </h1>
            <p className="m-0 max-w-xl text-lg leading-snug text-black/65 sm:text-xl">
              {study.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={study.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white no-underline transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Kunjungi website
                <span className="sr-only"> (buka di tab baru)</span>
              </a>
            </div>

            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {study.stack.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-black/[0.07] px-3 py-1 text-xs font-medium text-black/70"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="h-64 overflow-hidden rounded-2xl bg-white/25 sm:h-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={study.image}
              alt={`Tampilan proyek ${study.name}`}
              className="h-full w-full object-cover"
            />
          </div>
        </header>

        {/* Sorotan */}
        <ul className="m-0 mt-6 grid list-none gap-3 p-0 sm:grid-cols-3">
          {study.highlights.map((h) => (
            <li
              key={h}
              className="rounded-2xl bg-white p-5 text-base leading-snug text-neutral-800"
            >
              {h}
            </li>
          ))}
        </ul>

        {/* Isi + daftar isi */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14">
          <nav aria-label="Daftar isi" className="hidden lg:block">
            <ol className="sticky top-8 m-0 flex list-none flex-col gap-2 p-0 text-sm">
              {study.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-neutral-500 no-underline transition-colors hover:text-neutral-900"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-3xl">
            {study.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-8 border-t border-neutral-200 py-10 first:border-t-0 first:pt-0"
              >
                <h2 className="m-0 mb-4 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                  {section.heading}
                </h2>

                {section.paragraphs?.map((p) => (
                  <p
                    key={p}
                    className="m-0 mb-4 text-base leading-relaxed text-neutral-700 sm:text-lg"
                  >
                    {p}
                  </p>
                ))}

                {section.code && section.code.length > 0 ? (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {section.code.map((c) => (
                      <code
                        key={c}
                        className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-neutral-100"
                      >
                        {c}
                      </code>
                    ))}
                  </div>
                ) : null}

                {section.bullets ? (
                  <ul className="m-0 mb-4 flex list-disc flex-col gap-2 pl-5 text-base leading-relaxed text-neutral-700 sm:text-lg">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}

                {section.steps ? (
                  <ol className="m-0 mb-4 flex list-decimal flex-col gap-2 pl-5 text-base leading-relaxed text-neutral-700 marker:font-medium marker:text-neutral-500 sm:text-lg">
                    {section.steps.map((st) => (
                      <li key={st}>{st}</li>
                    ))}
                  </ol>
                ) : null}

                {section.callout ? (
                  <aside
                    style={{ backgroundColor: study.color }}
                    className="rounded-2xl p-5 text-base leading-relaxed text-black/80"
                  >
                    {section.callout}
                  </aside>
                ) : null}
              </section>
            ))}

            <blockquote
              style={{ borderColor: study.color }}
              className="m-0 mt-4 border-l-4 py-1 pl-5 text-xl font-medium leading-snug tracking-tight text-neutral-900 sm:text-2xl"
            >
              {study.principle}
            </blockquote>

            {study.closingNote ? (
              <p className="mt-8 text-sm leading-relaxed text-neutral-500">
                {study.closingNote}
              </p>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={study.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white no-underline hover:bg-neutral-800"
              >
                Kunjungi website
                <span className="sr-only"> (buka di tab baru)</span>
              </a>
              <Link
                href="/#karya"
                className="inline-flex items-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-900 no-underline hover:bg-neutral-100"
              >
                Lihat karya lainnya
              </Link>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}