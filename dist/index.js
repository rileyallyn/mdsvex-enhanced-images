// src/index.ts
import { sep } from "node:path";
import { visit } from "unist-util-visit";
function escapeHtmlAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var defaultResolverFactory = (relativeHandler = (path) => `.${sep}${path}`) => (path) => {
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("$") || path.startsWith("@") || path.startsWith(`.${sep}`) || path.startsWith(`..${sep}`)) {
    return path;
  } else {
    return relativeHandler(path);
  }
};
var parseAltText = (alt) => {
  const match = alt.match(/^\(([^)]+)\)/);
  if (match) {
    const [, dimensions] = match;
    const [width, height] = dimensions.split(" ");
    return { alt: alt.replace(/\([^)]*\)/, "").trim(), width, height };
  }
  return { alt, width: null, height: null };
};
var enhancedImages = (config) => {
  const resolvedConfig = {
    resolve: defaultResolverFactory(),
    ...config
  };
  return (tree) => {
    visit(tree, "image", (node, index, parent) => {
      if (node.url.startsWith("http://") || node.url.startsWith("https://")) {
        return;
      }
      node.type = "html";
      let imgHtml = `<enhanced:img src="${node.url}"`;
      if (node.alt !== null) {
        let { alt, width, height } = parseAltText(node.alt);
        imgHtml += ` alt="${escapeHtmlAttribute(alt)}"`;
        if (width !== null) {
          imgHtml += ` width="${width}"`;
        }
        if (height !== null) {
          imgHtml += ` height="${height}"`;
        }
      }
      if (node.title !== null && node.title !== void 0 && node.title !== "") {
        imgHtml += ` title="${escapeHtmlAttribute(node.title)}"`;
      }
      imgHtml += ` />`;
      node.value = imgHtml;
    });
  };
};
export {
  defaultResolverFactory,
  enhancedImages,
  parseAltText
};
