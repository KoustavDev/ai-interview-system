export const metadata = {
  title: "Post Job | AI Interview System",
  description: "Recruiters can create and publish new job postings.",
};

export default async function Layout({ children }) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}
