type ClassValue = string | false | null | undefined;

/**
 * Joins conditional class names. Deliberately dependency free — order matters,
 * so put the class that should win last.
 */
export function cn(...classes: ClassValue[]): string {
    return classes.filter(Boolean).join(' ');
}
