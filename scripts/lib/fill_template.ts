export function fillTemplate(template: string, values: Readonly<Record<string, string>>): string {
  return template.replaceAll(/\{(\w+)\}/g, (placeholder, name: string) => {
    const value = values[name];

    if (value === undefined) {
      throw new Error(`no value for ${placeholder} in "${template}"`);
    }

    return value;
  });
}
