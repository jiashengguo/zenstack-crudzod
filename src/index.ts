import { PluginOptions } from '@zenstackhq/sdk';
import { Model, DataModel, isDataModel } from '@zenstackhq/sdk/ast';
import path from 'path';
import { CRUDZodGenerator } from './generator';
import fs from 'fs';

export const name = 'zenstack-curdzod';

export default async function run(model: Model, options: PluginOptions) {
    // Process options
    const outputDir = (options.output as string) || '.';
    const outputFile = 'crud-zod.ts';

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get all data models
    const dataModels = model.declarations.filter((x): x is DataModel => isDataModel(x));

    // Create the generator instance
    const generator = new CRUDZodGenerator();

    // Generate the Zod schemas using ts-morph
    const project = generator.generateZodSchemas(dataModels, outputFile);

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    // Write the combined schemas file
    const allSchemasFile = project.getSourceFile(outputFile);
    if (allSchemasFile) {
        fs.writeFileSync(path.join(outputDir, outputFile), allSchemasFile.getFullText());
    }
}
