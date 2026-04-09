import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export interface TagSummary {
	name: string;
	slug: string;
	count: number;
}

export interface TagGroup {
	name: string;
	slug: string;
	posts: BlogPost[];
}

export function tagToSlug(tag: string): string {
	return tag
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-');
}

export function getTagsWithPosts(posts: BlogPost[]): TagGroup[] {
	const tagMap = new Map<string, TagGroup>();

	for (const post of posts) {
		for (const rawTag of post.data.tags ?? []) {
			const name = rawTag.trim();
			if (!name) continue;

			const slug = tagToSlug(name);
			const existing = tagMap.get(slug);
			if (existing) {
				existing.posts.push(post);
			} else {
				tagMap.set(slug, { name, slug, posts: [post] });
			}
		}
	}

	return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getTagSummaries(posts: BlogPost[]): TagSummary[] {
	return getTagsWithPosts(posts).map(({ name, slug, posts: taggedPosts }) => ({
		name,
		slug,
		count: taggedPosts.length,
	}));
}
