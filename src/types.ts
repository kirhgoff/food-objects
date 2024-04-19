export interface LinkMapping {
  page: string;
  links: { [key: string]: string };
}

export interface LinksMappings {
  mappings: LinkMapping[];
}

// export interface Story {
//   frontmatter: {
//     title: string;
//     links?: string[];
//   };
//   content: string;
// }
