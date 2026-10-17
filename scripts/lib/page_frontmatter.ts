import type { PageFrontmatterFields } from "../types/page_frontmatter_fields.type";

export function pageFrontmatter(fields: PageFrontmatterFields): string {
  const sidebar = [
    ...(fields.sidebarLabel === undefined ? [] : [`  label: ${JSON.stringify(fields.sidebarLabel)}`]),
    ...(fields.sidebarOrder === undefined ? [] : [`  order: ${fields.sidebarOrder}`])
  ];

  return [
    "---",
    `title: ${JSON.stringify(fields.title)}`,
    `description: ${JSON.stringify(fields.description)}`,
    "editUrl: false",
    ...(sidebar.length === 0 ? [] : ["sidebar:", ...sidebar]),
    ...(fields.sourceHash === undefined ? [] : [`sourceHash: ${JSON.stringify(fields.sourceHash)}`]),
    "---"
  ].join("\n");
}
