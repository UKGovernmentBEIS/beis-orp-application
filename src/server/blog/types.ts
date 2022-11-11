export interface BlogPostView {
  posts: BlogPost[];
}

export interface BlogPost {
  title: string;
  author: string;
  date: string;
  tags: { name: string; href: string }[];
  description: string;
  youtubeId: string;
}
