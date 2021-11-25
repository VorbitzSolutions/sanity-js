// Example: How to make the API calls


// API Init
const client = sanityClient(options)

// Sanity Query
client.fetch(query, params = {})

// Listening to queries
// to unsubscribe later on
subscription.unsubscribe()

// Fetch a single document
// Fetch multiple documents in one go

// Creating documents
client.create(doc)

// Creating/replacing documents
client.createOrReplace(doc)

// Creating if not already present
client.createIfNotExists(doc)

// Patch/update a document
// Setting a field only if not already pres
// Removing/unsetting fields
// Incrementing/decrementing numbers

// Patch a document only if revision matches
// Adding elements to an array
// Appending/prepending elements to an array

// Deleting an element from an array
 client.transaction().create(doc).patch(docId, p => p.set(partialDoc)).commit()
 // client.asset.upload(type: 'file' | image', body: File | Blob | Buffer | NodeStream, options = {}): Promise<AssetDocument>
// Examples: Uploading assets from the Browser
// Draw something on a canvas and upload as image
// Examples: Specify image metadata to extract
// Extract palette of colors as well as GPS location from exif

// Get client configuration
client.config()

// Set client configuration
client.config(options)