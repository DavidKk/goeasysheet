export type Get<B extends { [key: string]: any }, T extends string> = B[T]
