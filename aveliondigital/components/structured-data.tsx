type JsonLdObject = Record<string, unknown>;
type JsonLd = JsonLdObject | ReadonlyArray<JsonLdObject>;

function isJsonLdArray(data: JsonLd): data is ReadonlyArray<JsonLdObject> {
  return Array.isArray(data);
}

function stripContext(item: JsonLdObject): JsonLdObject {
  const { ["@context"]: _context, ...rest } = item;
  return rest;
}

function toDocument(data: JsonLd): JsonLdObject {
  if (isJsonLdArray(data)) {
    return {
      "@context": "https://schema.org",
      "@graph": data.map(stripContext),
    };
  }

  if ("@context" in data) {
    return data;
  }

  return { "@context": "https://schema.org", ...data };
}

export function StructuredData({ data }: { data: JsonLd }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(toDocument(data)) }}
    />
  );
}
