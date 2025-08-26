export const metadata = {
  title: "Profile | AI Interview System",
  description: "View and manage your personal profile and account settings.",
};
export default async function Layout({ children, params }) {
  const { id } = await params;
  return (
    <div className="profile-container mb-16 lg:mb-0">
      <section>{children}</section>
    </div>
  );
}
