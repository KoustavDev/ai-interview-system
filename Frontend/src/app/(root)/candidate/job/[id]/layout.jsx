export const metadata = {
  title: "Job | AI Interview System",
  description: "Detailed information about a specific job post.",
};
export default async function Layout({ children, params }) {
  const { id } = await params;
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}
