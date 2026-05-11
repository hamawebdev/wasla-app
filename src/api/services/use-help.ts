import { useQuery } from '@tanstack/react-query';
import { MOCK_HELP_ARTICLES, MOCK_HELP_CATEGORIES } from '../fixtures/help-articles';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useHelpCategories() {
  return useQuery({
    queryKey: ['help', 'categories'],
    queryFn: async () => {
      await delay(200);
      return [...MOCK_HELP_CATEGORIES];
    },
    staleTime: Infinity,
  });
}

export function useHelpArticles(categoryId?: string) {
  return useQuery({
    queryKey: ['help', 'articles', categoryId],
    queryFn: async () => {
      await delay(300);
      if (categoryId) {
        return MOCK_HELP_ARTICLES.filter((a) => a.categoryId === categoryId);
      }
      return [...MOCK_HELP_ARTICLES];
    },
    staleTime: Infinity,
  });
}

export function useHelpArticle(id: string) {
  return useQuery({
    queryKey: ['help', 'articles', 'detail', id],
    queryFn: async () => {
      await delay(200);
      return MOCK_HELP_ARTICLES.find((a) => a.id === id) ?? null;
    },
    enabled: !!id,
    staleTime: Infinity,
  });
}
