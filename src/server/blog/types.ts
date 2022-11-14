export interface BlogPostsView {
  posts: BlogPost[];
}

export interface BlogPostView {
  post: BlogPost;
}

export interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  tags: { name: string; href: string }[];
  description: string;
  youtubeId: string;
}
