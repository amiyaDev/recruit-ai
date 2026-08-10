// Mirrors backend/core/constants.py (ALLOWED_RESUME_EXTENSIONS, MAX_RESUME_SIZE_BYTES)
// so invalid files are rejected instantly client-side instead of wasting a
// round trip to have the server reject them with the same rule.
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function validateResumeFile(file: File): string | null {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return "Only PDF and DOCX files are supported.";
  }

  if (file.size > MAX_SIZE_BYTES) {
    return "File exceeds the 5MB size limit.";
  }

  return null;
}
