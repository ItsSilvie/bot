declare namespace Intl {
  class ListFormat {
    constructor(locales?: string | string[]);
    public format: (items: string[]) => string;
  }
}