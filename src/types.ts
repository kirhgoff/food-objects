export interface LinkMappingEntry { 
  from: string;
  to: string;
};

export interface LinkMapping {
  page: string;
  links: LinkMappingEntry[];
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
