import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

export function compileTemplate(templateName: string, data: any): string {
  const templatePath = path.join(
    process.cwd(),
    `./mail-templates/${templateName}.hbs`,
  );
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  return template(data);
}
