type Get<data extends { [key: string]: any }, T extends string> = data[T]
type Optional<T> = { [K in keyof T]?: T[K] }
