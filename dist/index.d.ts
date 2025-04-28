import { Plugin } from 'unified';

type Config = {
    resolve: (path: string) => string;
};
declare const defaultResolverFactory: (relativeHandler?: (path: string) => string) => (path: string) => string;
declare const parseAltText: (alt: string) => {
    alt: string;
    width: string;
    height: string;
} | {
    alt: string;
    width: null;
    height: null;
};
declare const enhancedImages: Plugin<[Partial<Config>?], any>;

export { type Config, defaultResolverFactory, enhancedImages, parseAltText };
