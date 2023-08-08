export const documentsIndex = {
	name: 'guidelines-v1',
	fields: [
		{name: 'chunkId', type: 'Edm.String', key: true, filterable: true},
		{name: 'documentId', type: 'Edm.String', filterable: true},
		{name: 'accountId', type: 'Edm.String', filterable: true},
		{name: 'name', type: 'Edm.String', searchable: true, filterable: true, sortable: true, facetable: true},
		{name: 'category', type: 'Edm.String', searchable: true, filterable: true, sortable: true, facetable: true},
		{name: 'tags', type: 'Collection(Edm.String)', searchable: true, filterable: true, sortable: false, facetable: true, analyzer: 'tagsAnalyzer'},
		{name: 'content', type: 'Edm.String', searchable: true, filterable: true, sortable: true, facetable: true},
		{name: 'contentVector', type: 'Collection(Edm.Single)', searchable: true, filterable: false, sortable: false, facetable: false, retrievable: true, analyzer: '', dimensions: 1536, vectorSearchConfiguration: 'vectorConfig'},

	]}
