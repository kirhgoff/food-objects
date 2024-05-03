import linksMapping from './data/linksMapping.json'

export function preprocessMarkdown(markdown: string, pageId: string, links: string[]) {
  console.log(`Called with: ${pageId} and ${links}`)
  if (!links) return markdown

  var content = markdown

  const mappingsForPage = linksMapping
    .mappings
    .find(mapping => mapping.page === pageId)?.links || [];

  console.log("Page links: " + JSON.stringify(mappingsForPage))

  links.forEach((fromLink) => {
    const toLinkEntry = mappingsForPage
      .find(mapping => mapping.from === fromLink)

    if (!toLinkEntry) return

    const toLink = toLinkEntry.to
    const mediaType = toLinkEntry.mediaType

    const target = `/${mediaType}/${toLink}`
    console.log(`replacing: ${fromLink} with ${target}`)

    const pattern = new RegExp(`link:${fromLink}`, 'g'); 
    console.log(`Matches: ${markdown.match(pattern)}`)
    content = content.replace(pattern, target);
  });
  return content;
}
