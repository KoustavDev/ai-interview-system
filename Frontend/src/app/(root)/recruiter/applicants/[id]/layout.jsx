export const metadata = {
  title: "Applications | AI Interview System",
  description:
    "Recruiters can view candidates' applications for a specific job.",
};

export default async function Layout({ children, params }) {
  const { id } = await params;
  return (
    <div className="profile-container mb-16 lg:mb-0">
      <section>{children}</section>
    </div>
  );
}
