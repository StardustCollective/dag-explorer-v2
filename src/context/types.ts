export type Theme = 'light' | 'dark';
export type ThemeContextType = {
  theme: Theme;
  changeTheme: (theme: Theme) => void;
};
