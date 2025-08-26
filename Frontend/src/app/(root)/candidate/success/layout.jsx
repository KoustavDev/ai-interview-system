export const metadata = {
  title: "Success | AI Interview System",
  description: "Candidate's AI interview completed successfully.",
};
export default async function Layout({ children }) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}
