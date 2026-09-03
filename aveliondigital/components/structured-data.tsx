type JsonLdObject = Record<string, unknown>;
type JsonLd = JsonLdObject | ReadonlyArray<JsonLdObject>;

function stripContext(item: JsonLdObject): JsonLdObject {
  const { ["@context"]: _context, ...rest } = item;
  return rest;
}

function toDocument(data: JsonLd): JsonLdObject {
  if (!Array.isArray(data)) {
    return data["@context"]
      ? data
      : { "@context": "https://schema.org", ...data };
  }

  return {
    "@context": "https://schema.org",
    "@graph": data.map(stripContext),
  };
}

export function StructuredData({ data }: { data: JsonLd }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(toDocument(data)) }}
    />
  );
}
