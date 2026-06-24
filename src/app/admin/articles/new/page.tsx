import ArticleForm from "../ArticleForm";

export const metadata = { title: "New Article | KeFeL Admin" };

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
        New Article
      </h1>
      <ArticleForm />
    </div>
  );
}
