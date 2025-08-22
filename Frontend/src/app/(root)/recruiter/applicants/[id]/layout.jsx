export default async function Layout({ children, params }) {
  const { id } = await params;
  return (
    <div className="profile-container mb-16 lg:mb-0">
      <section>{children}</section>
    </div>
  );
}
