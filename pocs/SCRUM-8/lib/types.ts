export type DemoActor = {
  id: string;
  name: string;
  initials: string;
};

export type Cook = {
  id: string;
  name: string;
  initials: string;
  tagline?: string;
};

export type Recipe = {
  id: string;
  title: string;
  authorId: string;
  servings: number;
  timeMinutes: number;
  ingredients: string[];
  steps: string[];
  tags?: string[];
  photoDataUrl?: string;
  publishedAt: number;
};

export type RecipeInput = {
  title: string;
  servings: number;
  timeMinutes: number;
  ingredients: string[];
  steps: string[];
  tags?: string[];
  photoDataUrl?: string;
};

export type EmailNotification = {
  id: string;
  actorId: string;
  cookName: string;
  recipeTitle: string;
  createdAt: number;
};
