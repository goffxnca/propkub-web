const joinClasses = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Centralized variant types for consistent styling across the application.
 * These variants can be used by Badge, Icon, Button, and other components.
 * Each component decides its own CSS implementation for these variants.
 */
export type Variant =
  | 'gray'
  | 'error'
  | 'warning'
  | 'success'
  | 'info'
  | 'indigo'
  | 'purple'
  | 'pink';

export { joinClasses };
