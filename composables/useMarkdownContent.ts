import { ref } from "vue";
import { marked } from "marked";

const BASE_PATH = "/overlays/";

export function useMarkdownContent() {
  const content = ref("");

  const processInlineMarkdown = (input: string): string => {
    if (!input) {
      console.error("No input provided to processInlineMarkdown");
      return "No content available.";
    }

    try {
      return marked(input);
    } catch (error: any) {
      console.error("Error processing inline markdown:", error);
      return `Error processing markdown: ${error.message}`;
    }
  };

  const loadMarkdownFile = async (filename: string): Promise<string> => {
    if (!filename) {
      console.error("No filename provided to loadMarkdownFile");
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
      return processInlineMarkdown(markdown);
    } catch (error: any) {
      console.error("Error loading markdown content:", error);
      return `Error loading content: ${error.message}`;
    }
  };

  return {
    content,
    processInlineMarkdown,
    loadMarkdownFile,
  };
}
