import dynamic from 'next/dynamic';

const PdfEditor = dynamic(
  () => import('../components/PdfEditor').then(mod => mod.PdfEditor),
  { ssr: false }
);

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      <PdfEditor />
    </main>
  );
}
