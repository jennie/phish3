// composables/useMarkdownContent.ts
import { ref } from "vue";
import { marked } from "marked";

const BASE_PATH = "/overlays/";

export function useMarkdownContent() {
  const content = ref("");

  const loadMarkdownContent = async (filename: string): Promise<string> => {
    if (!filename) {
      console.error("No filename provided to loadMarkdownContent");
      return "No content available.";
    }

    const fullPath = `${BASE_PATH}${filename}`;
    console.log(`Attempting to fetch markdown from: ${fullPath}`);

    try {
      const response = await fetch(fullPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const markdown = await response.text();
      console.log("Markdown fetched successfully, length:", markdown.length);
      const html = marked(markdown);
      content.value = html;
      return html;
    } catch (error: any) {
      console.error("Error loading markdown content:", error);
      throw error;
    }
  };

  return {
    content,
    loadMarkdownContent,
  };
}
