import { Breadcrumb } from "@/components/breadcrumb"
import { NewsFeed } from "@/components/news-feed"

export default function NewsPage() {
  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/news", label: "News & Updates" },
        ]}
      />
      <h1 className="text-3xl font-bold">News & Updates</h1>
      <NewsFeed />
    </div>
  )
}

