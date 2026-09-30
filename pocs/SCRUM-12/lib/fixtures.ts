import type { Cook, Recipe } from "./types";

export const initialCooks: Cook[] = [
  { id: "cook-mara", displayName: "Mara Whitfield", email: "mara.whitfield@example.cook" },
  { id: "cook-jules", displayName: "Jules Okonkwo", email: "jules.okonkwo@example.cook" },
  { id: "cook-sage", displayName: "Sage Lin", email: "sage.lin@example.cook" },
  { id: "cook-demo", displayName: "Demo Follower", email: "demo.follower@example.cook" },
];

export const initialRecipes: Recipe[] = [
  {
    id: "recipe-1",
    title: "Sunday Herb Frittata",
    authorId: "cook-mara",
    servings: 4,
    timeMinutes: 35,
    ingredients: ["eggs", "fresh basil", "goat cheese", "olive oil", "sea salt"],
    steps: [
      "Whisk eggs with a pinch of salt until airy.",
      "Sauté basil in olive oil for one minute.",
      "Pour eggs into the pan and crumble goat cheese on top.",
      "Bake at 375°F until set, about 12 minutes.",
    ],
    tags: ["brunch", "vegetarian"],
    photoSubtitle: "Basil and goat cheese",
  },
  {
    id: "recipe-2",
    title: "Citrus Roasted Carrots",
    authorId: "cook-jules",
    servings: 6,
    timeMinutes: 40,
    ingredients: ["carrots", "orange zest", "thyme", "butter", "black pepper"],
    steps: [
      "Peel and halve carrots lengthwise.",
      "Toss with melted butter, zest, and thyme.",
      "Roast until caramelized at the edges.",
      "Finish with cracked pepper before serving.",
    ],
    tags: ["side dish", "weeknight"],
    photoSubtitle: "Bright winter side",
  },
  {
    id: "recipe-3",
    title: "Miso Ginger Broth",
    authorId: "cook-sage",
    servings: 2,
    timeMinutes: 25,
    ingredients: ["miso paste", "fresh ginger", "scallions", "silken tofu", "sesame oil"],
    steps: [
      "Simmer ginger in water for ten minutes.",
      "Whisk miso into the warm broth off the heat.",
      "Add cubed tofu and sliced scallions.",
      "Drizzle sesame oil and serve immediately.",
    ],
    tags: ["comfort", "quick"],
    photoSubtitle: "Silken tofu bowl",
  },
  {
    id: "recipe-4",
    title: "Honey Pan Bread",
    authorId: "cook-mara",
    servings: 8,
    timeMinutes: 90,
    ingredients: ["bread flour", "honey", "active yeast", "warm water", "butter"],
    steps: [
      "Proof yeast with honey and warm water.",
      "Knead dough until smooth and elastic.",
      "Let rise until doubled in a buttered bowl.",
      "Bake until deep golden and hollow sounding.",
    ],
    tags: ["baking", "shareable"],
    photoSubtitle: "Pull-apart loaf",
  },
];

/** cook-demo follows mara and jules for seeded feed demos */
export const initialFollows: Array<{ followerId: string; cookId: string }> = [
  { followerId: "cook-demo", cookId: "cook-mara" },
  { followerId: "cook-demo", cookId: "cook-jules" },
];
