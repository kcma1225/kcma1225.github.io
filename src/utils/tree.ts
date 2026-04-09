import type { CollectionEntry } from 'astro:content';

export interface TreeNode {
  /** File/folder name (last path segment) */
  name: string;
  /** Full path from collection root, e.g. "tech/javascript" */
  path: string;
  type: 'folder' | 'post';
  /** post.id — only set for type === 'post' */
  slug?: string;
  children: TreeNode[];
  /** Total post count in this subtree */
  postCount: number;
}

/**
 * Build a recursive TreeNode tree from a flat list of blog posts.
 * post.id is assumed to be the slash-separated path without extension,
 * e.g. "root-post", "tech/javascript/my-article".
 */
export function buildTree(posts: CollectionEntry<'blog'>[]): TreeNode[] {
  // Internal map key: 'dir:name' for folders, 'post:name' for leaves
  // This prevents collisions when a root file (e.g. "test.md" → id "test")
  // shares a prefix with a subfolder (e.g. "test/child.md").
  type Entry = { node: TreeNode; childMap: Map<string, Entry> };
  const rootMap = new Map<string, Entry>();

  for (const post of posts) {
    const parts = post.id.split('/');
    let currentMap = rootMap;
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const path = currentPath ? `${currentPath}/${name}` : name;
      const isLast = i === parts.length - 1;
      // Use a type-prefixed key so a folder 'test/' and a post 'test.md'
      // never stomp on each other in the same map level.
      const key = isLast ? `post:${name}` : `dir:${name}`;

      if (!currentMap.has(key)) {
        currentMap.set(key, {
          node: {
            name,
            path,
            type: isLast ? 'post' : 'folder',
            slug: isLast ? post.id : undefined,
            children: [],
            postCount: 0,
          },
          childMap: new Map(),
        });
      }

      // Only descend into the next level for non-leaf (folder) segments.
      if (!isLast) {
        currentMap = currentMap.get(key)!.childMap;
      }
      currentPath = path;
    }
  }

  function extract(map: Map<string, Entry>): TreeNode[] {
    const nodes: TreeNode[] = [];
    for (const { node, childMap } of map.values()) {
      node.children = extract(childMap);
      node.postCount =
        node.type === 'post'
          ? 1
          : node.children.reduce((s, c) => s + c.postCount, 0);
      nodes.push(node);
    }
    // Folders first, then posts — each group sorted A-Z
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    return nodes;
  }

  return extract(rootMap);
}
