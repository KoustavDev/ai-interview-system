export const metadata = {
  title: "Report | AI Interview System",
  description:
    "Recruiters can review AI-generated interview reports for candidates.",
};

export default async function Layout({ children, params }) {
  const { id } = await params;
  return (
    <div className="profile-container mb-16 lg:mb-0">
      <section>{children}</section>
    </div>
  );
}
// Electric
