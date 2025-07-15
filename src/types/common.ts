export interface Country {
  flags: {
    png: string
    svg: string
    alt: string
  }
  name: {
    common: string
    official: string
  }
  idd?: {
    root: string
    suffixes: string[]
  }
  cca2: string
}
