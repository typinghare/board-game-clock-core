export function getClassName(object: object): string {
    return Object.getPrototypeOf(object).constructor.name
}