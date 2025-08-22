This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



# Debugging Document: Preventing Unnecessary Query Calls in React Query

## **Context**

While working on an **AI-Infused Interview System**, we implemented two custom hooks using React Query:

* `useJobs` → Fetches jobs with pagination via `useInfiniteQuery`.
* `useAppliedJobs` → Fetches applied jobs via `useQuery`.

During development, we noticed that **`useAppliedJobs` was being called immediately**, even if **`useJobs` (page 1) hadn’t yet loaded**. This created extra network requests and potential performance issues.

---

## **Initial Code**

```ts
export const useJobs = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_JOBS],
    queryFn: ({ pageParam = 1 }) => getJobs({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.currentPage < lastPage?.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
};

export const useAppliedJobs = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPLIED_JOBS],
    queryFn: () => appliedJobs(),
  });
};
```

---

## **Problem**

* `useAppliedJobs` ran on **every mount**, regardless of whether `useJobs` had data loaded or not.
* This was unwanted behavior: we only wanted `useAppliedJobs` to run **after jobs were fetched**.

---

## **Debugging Process**

1. **Suspected an imposter call**
   Checked if `useAppliedJobs` was being triggered unintentionally by React Query’s default behavior.

2. **Validated with logs**
   Inserted console logs in `queryFn` and confirmed that `appliedJobs()` ran immediately.

3. **Investigated React Query defaults**
   Learned that queries **automatically run on mount** unless explicitly disabled.

4. **Solution Identified**
   Used the `enabled` flag in `useQuery` to **conditionally control execution**.

---

## **Final Fix**

```ts
export const useAppliedJobs = (isJobsLoaded: boolean) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPLIED_JOBS],
    queryFn: () => appliedJobs(),
    enabled: isJobsLoaded, // ✅ only run when jobs are loaded
  });
};
```

Usage:

```ts
const { data: jobsData, isSuccess: isJobsLoaded } = useJobs();
const appliedJobsQuery = useAppliedJobs(isJobsLoaded);
```

---

## **Outcome**

* ✅ `useAppliedJobs` only executes **after jobs are loaded**.
* ✅ Prevents unnecessary API calls.
* ✅ Better user experience & reduced server load.

---

## **Key Learnings**

1. React Query runs all queries **immediately on mount by default**.
2. The `enabled` option is the correct way to control **when queries fire**.
3. Always double-check query dependencies in multi-query workflows.


