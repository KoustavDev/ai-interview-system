export default function extractFileNameFromUrl(url) {
  try {
    // Create a URL object to safely parse the string
    const parsed = new URL(url);
    const pathname = parsed.pathname; // e.g., "/.../Koustav-Majh-Resume.pdf"

    // Split the pathname by "/" and take the last segment
    const segments = pathname.split("/");
    const fileName = segments.pop() || null;

    return fileName;
  } catch (err) {
    // If URL parsing fails, return null
    console.error("Invalid URL:", err);
    return null;
  }
}
