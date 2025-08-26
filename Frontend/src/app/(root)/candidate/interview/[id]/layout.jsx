export const metadata = {
  title: "Interview | AI Interview System",
  description: "AI-powered interview experience for the candidate.",
};
export default async function Layout({ children, params }) {
  const { id } = await params;
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}
