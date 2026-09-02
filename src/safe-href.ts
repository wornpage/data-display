const FORBIDDEN_CODE_POINT = /[\p{Cc}\p{Cf}\p{Z}]/u;
const SCHEME_PREFIX = /^([a-z][a-z0-9+.-]*):/iu;
const SAFE_SCHEMES = new Set(['https:', 'mailto:', 'tel:']);

export function assertSafeHref(value: unknown): string {
	if (typeof value !== 'string' || value.length === 0) {
		throw new TypeError('href must be a non-empty string');
	}
	if (FORBIDDEN_CODE_POINT.test(value)) {
		throw new TypeError('href must not contain separator, control, or formatting characters');
	}
	if (value.startsWith('//') || value.includes('\\')) {
		throw new TypeError('href must not use a network-path reference or backslash');
	}

	const scheme = SCHEME_PREFIX.exec(value)?.[1];
	if (scheme && !SAFE_SCHEMES.has(`${scheme.toLowerCase()}:`)) {
		throw new TypeError('href scheme must be https, mailto, or tel');
	}

	return value;
}
