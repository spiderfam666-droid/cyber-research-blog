import { getCollection, type CollectionEntry } from 'astro:content';
import { categoryToSlug } from '../consts';

export type BlogPost = CollectionEntry<'blog'>;

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

export function getPostsByCategory(
  posts: BlogPost[],
  categorySlug: string
): BlogPost[] {
  return posts.filter((post) =>
    post.data.categories.some(
      (cat) => categoryToSlug(cat) === categorySlug
    )
  );
}

export function getPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  const normalized = tag.toLowerCase();
  return posts.filter((post) =>
    post.data.tags.some((t) => t.toLowerCase() === normalized)
  );
}

export function getAllTags(posts: BlogPost[]): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const key = tag.toLowerCase();
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getAllCategoriesFromPosts(
  posts: BlogPost[]
): { name: string; slug: string; count: number }[] {
  const map = new Map<string, { name: string; count: number }>();
  for (const post of posts) {
    for (const cat of post.data.categories) {
      const slug = categoryToSlug(cat);
      const existing = map.get(slug);
      if (existing) {
        existing.count++;
      } else {
        map.set(slug, { name: cat, count: 1 });
      }
    }
  }
  return [...map.entries()]
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getRelatedPosts(
  post: BlogPost,
  allPosts: BlogPost[],
  limit = 3
): BlogPost[] {
  const postTags = new Set(post.data.tags.map((t) => t.toLowerCase()));
  const postCategories = new Set(
    post.data.categories.map((c) => categoryToSlug(c))
  );

  return allPosts
    .filter((p) => p.id !== post.id)
    .map((p) => {
      let score = 0;
      for (const tag of p.data.tags) {
        if (postTags.has(tag.toLowerCase())) score += 2;
      }
      for (const cat of p.data.categories) {
        if (postCategories.has(categoryToSlug(cat))) score += 3;
      }
      return { post: p, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf())
    .slice(0, limit)
    .map(({ post }) => post);
}

export function getAdjacentPosts(
  post: BlogPost,
  allPosts: BlogPost[]
): { prev: BlogPost | null; next: BlogPost | null } {
  const index = allPosts.findIndex((p) => p.id === post.id);
  return {
    prev: index > 0 ? allPosts[index - 1] : null,
    next: index < allPosts.length - 1 ? allPosts[index + 1] : null,
  };
}

export function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
