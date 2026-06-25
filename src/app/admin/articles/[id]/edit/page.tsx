import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import ArticleForm from "../../ArticleForm";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Edit Article | KeFeL Admin" };

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;

  const { data: article } = await supabaseAdmin
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (!article) notFound();

  const author =
    typeof article.author === "string"
      ? JSON.parse(article.author)
      : article.author;

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
        Edit Article
      </h1>
        <ArticleForm
          initial={{
            id: article.id,
            slug: article.slug,
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            authorName: author.name ?? "",
            authorRole: author.role ?? "",
            image: article.image ?? "",
            imageCaption: article.image_caption ?? "",
            imageCredit: article.image_credit ?? "",
            status: article.status ?? "draft",
            tags: (article.tags ?? []).join(", "),
            featured: article.featured,
            trending: article.trending,
            publishedAt: article.published_at
              ? new Date(article.published_at).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16),
            readingTime: article.reading_time ?? 5,
            highlights: article.highlights ?? [],
          }}
      />
    </div>
  );
}
