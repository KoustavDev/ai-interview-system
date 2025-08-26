export const metadata = {
  title: "My Applications | AI Interview System",
  description:
    "Candidates can view and track the status of their job applications.",
};
export default async function Layout({ children }) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}
