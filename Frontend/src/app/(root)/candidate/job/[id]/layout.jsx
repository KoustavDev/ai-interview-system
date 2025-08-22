export default async function Layout({ children, params }) {
  const { id } = await params;
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}
