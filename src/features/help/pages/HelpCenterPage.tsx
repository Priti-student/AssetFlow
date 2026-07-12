import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  FileText,
  Video,
  ExternalLink,
  ChevronRight,
  Star,
  ThumbsUp,
  ArrowRight,
  X,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

const categories = [
  { icon: BookOpen, name: 'Getting Started', desc: 'Learn the basics of AssetFlow', articles: 12, color: 'from-primary to-accent' },
  { icon: FileText, name: 'Asset Management', desc: 'Managing organizational assets', articles: 18, color: 'from-secondary to-emerald-500' },
  { icon: MessageCircle, name: 'Bookings & Allocations', desc: 'Resource booking guides', articles: 15, color: 'from-accent to-blue-500' },
  { icon: Video, name: 'Video Tutorials', desc: 'Watch step-by-step guides', articles: 8, color: 'from-rose-500 to-red-500' },
  { icon: HelpCircle, name: 'FAQs', desc: 'Frequently asked questions', articles: 24, color: 'from-amber-500 to-orange-500' },
  { icon: Mail, name: 'Contact Support', desc: 'Get help from our team', articles: 4, color: 'from-purple-500 to-pink-500' },
];

const popularArticles = [
  { title: 'How to register a new asset', views: 2345, helpful: 98 },
  { title: 'Understanding asset statuses', views: 1890, helpful: 95 },
  { title: 'How to book a resource', views: 1567, helpful: 92 },
  { title: 'Maintenance request workflow', views: 1234, helpful: 90 },
  { title: 'Running audit cycles', views: 1123, helpful: 88 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ title: string; category: string; url: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      const res = await fetch(`/api/help/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setSearchResults(data.data);
          return;
        }
      }
    } catch (error) {
      // Fallback to local search
    }

    // Local search fallback
    const localResults = [
      { title: 'How to register a new asset', category: 'Getting Started', url: '#getting-started' },
      { title: 'Understanding asset statuses', category: 'Asset Management', url: '#asset-management' },
      { title: 'How to book a resource', category: 'Bookings & Allocations', url: '#bookings' },
      { title: 'Maintenance request workflow', category: 'Maintenance', url: '#maintenance' },
      { title: 'Running audit cycles', category: 'Audit', url: '#audit' },
      { title: 'Setting up notifications', category: 'Settings', url: '#settings' },
      { title: 'Managing departments', category: 'Organization', url: '#departments' },
      { title: 'Generating reports', category: 'Reports', url: '#reports' },
    ].filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(localResults);
    setIsSearching(false);
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleCategoryClick = (categoryName: string) => {
    alert(`Opening "${categoryName}" category. In production, this would navigate to the category page with relevant articles.`);
  };

  const handleArticleClick = (articleTitle: string) => {
    alert(`Opening article: "${articleTitle}". In production, this would navigate to the full article.`);
  };

  const handleStartChat = () => {
    alert('Live chat would open here. In production, this would connect to a support chat system.');
  };

  const handleSendEmail = () => {
    window.location.href = 'mailto:support@assetflow.com';
  };

  const handleViewDocs = () => {
    alert('Opening documentation. In production, this would open the full documentation portal.');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">Find answers, guides, and support for all your questions</p>
        <div className="relative max-w-xl mx-auto mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles, guides, FAQs..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-12 rounded-xl border border-input/50 bg-background pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto mt-2 bg-background border border-border/50 rounded-xl shadow-lg overflow-hidden"
          >
            {isSearching ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="divide-y divide-border/50">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleArticleClick(result.title)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-accent/5 transition-colors text-left"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{result.title}</p>
                      <p className="text-xs text-muted-foreground">{result.category}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found for "{searchQuery}"
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => handleCategoryClick(category.name)}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                      <category.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{category.desc}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="default" size="sm">{category.articles} articles</Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
            <CardDescription>Most viewed help articles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                onClick={() => handleArticleClick(article.title)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-6">{index + 1}.</span>
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{article.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>{article.views.toLocaleString()} views</span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" /> {article.helpful}% helpful
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>Our support team is here for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Chat with our support team</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-2" onClick={handleStartChat}>Start Chat</Button>
            </div>

            <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Mail className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">Get a response within 24 hours</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-2" onClick={handleSendEmail}>Send Email</Button>
            </div>

            <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Documentation</p>
                  <p className="text-sm text-muted-foreground">Read our detailed documentation</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-2" onClick={handleViewDocs}>View Docs</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}