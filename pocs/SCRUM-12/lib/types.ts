export type Cook = {
  id: string;
  displayName: string;
  email: string;
};

export type Recipe = {
  id: string;
  title: string;
  authorId: string;
  servings: number;
  timeMinutes: number;
  ingredients: string[];
  steps: string[];
  tags: string[];
  photoSubtitle?: string;
};

export type RecipeInput = {
  title: string;
  servings: number;
  timeMinutes: number;
  ingredients: string[];
  steps: string[];
  tags: string[];
  photoSubtitle?: string;
};

export type EmailNotification = {
  id: string;
  recipeId: string;
  recipeTitle: string;
  authorId: string;
  followerEmail: string;
  sentAt: string;
};
