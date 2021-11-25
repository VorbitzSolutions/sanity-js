// JavaScript API client
// https://www.sanity.io/plugins/javascript-api-client
// Install npm client: npm install --save @sanity/client

// API Init
const sanityClient = require('@sanity/client')
const client = sanityClient({
  projectId: 'your-project-id',
  dataset: 'bikeshop',
  token: 'sanity-auth-token', // or leave blank to be anonymous user
  useCdn: true // `false` if you want to ensure fresh data
})

// Sanity Query
const query = '*[_type == "bike" && seats >= $minSeats] {name, seats}'
const params = {minSeats: 2}

client.fetch(query, params).then(bikes => {
  console.log('Bikes with more than one seat:')
  bikes.forEach(bike => {
    console.log(`${bike.name} (${bike.seats} seats)`)
  })
})

// Listening to queries
const query = '*[_type == "comment" && authorId != $ownerId]'
const params = {ownerId: 'bikeOwnerUserId'}

const subscription = client.listen(query, params)
  .subscribe(update => {
    const comment = update.result
    console.log(`${comment.author} commented: ${comment.text}`)
  })

// to unsubscribe later on
subscription.unsubscribe()

// Fetch a single document
client.getDocument('bike-123').then(bike => {
  console.log(`${bike.name} (${bike.seats} seats)`)
})

// Fetch multiple documents in one go
client.getDocuments(['bike123', 'bike345']).then(([bike123, bike345]) => {
  console.log(`Bike 123: ${bike123.name} (${bike123.seats} seats)`)
  console.log(`Bike 345: ${bike345.name} (${bike345.seats} seats)`)
})

// Creating documents
const doc = {
  _type: 'bike',
  name: 'Sanity Tandem Extraordinaire',
  seats: 2
}

client.create(doc).then(res => {
  console.log(`Bike was created, document ID is ${res._id}`)
})

// Creating/replacing documents
const doc = {
  _id: 'my-bike',
  _type: 'bike',
  name: 'Sanity Tandem Extraordinaire',
  seats: 2
}

client.createOrReplace(doc).then(res => {
  console.log(`Bike was created, document ID is ${res._id}`)
})

// Creating if not already present
const doc = {
  _id: 'my-bike',
  _type: 'bike',
  name: 'Sanity Tandem Extraordinaire',
  seats: 2
}

client.createIfNotExists(doc).then(res => {
  console.log('Bike was created (or was already present)')
})

// Patch/update a document
client
  .patch('bike-123') // Document ID to patch
  .set({inStock: false}) // Shallow merge
  .inc({numSold: 1}) // Increment field by count
  .commit() // Perform the patch and return a promise
  .then(updatedBike => {
    console.log('Hurray, the bike is updated! New document:')
    console.log(updatedBike)
  })
  .catch(err => {
    console.error('Oh no, the update failed: ', err.message)
  })

  // Setting a field only if not already present
  client
  .patch('bike-123')
  .setIfMissing({title: 'Untitled bike'})
  .commit()

  // Removing/unsetting fields
client
  .patch('bike-123')
  .unset(['title', 'price'])
  .commit()

  // Incrementing/decrementing numbers
  client
  .patch('bike-123')
  .inc({price: 88, numSales: 1}) // Increment `price` by 88, `numSales` by 1
  .dec({inStock: 1}) // Decrement `inStock` by 1
  .commit()

  // Patch a document only if revision matches
  client
  .patch('bike-123')
  .ifRevisionId('previously-known-revision')
  .set({title: 'Little Red Tricycle'})
  .commit()

// Adding elements to an array
const {nanoid} = require('nanoid')

client
.patch('bike-123')
// Ensure that the `reviews` arrays exists before attempting to add items to it
.setIfMissing({reviews: []})
// Add the items after the last item in the array (append)
.insert('after', 'reviews[-1]', [
    // Add a `_key` unique within the array to ensure it can be addressed uniquely
    // in a real-time collaboration context
    {_key: nanoid(), title: 'Great bike!', stars: 5}
])
.commit()

// Appending/prepending elements to an array
const {nanoid} = require('nanoid')

client
  .patch('bike-123')
  .setIfMissing({reviews: []})
  .append('reviews', [
    {_key: nanoid(), title: 'Great bike!', stars: 5}
  ])
  .commit()

// Deleting an element from an array
const reviewsToRemove = ['reviews[0]', 'reviews[_key=="abc123"]']
client
  .patch('bike-123')
  .unset(reviewsToRemove)
  .commit()

 // Delete a document
  client.delete('bike-123')
  .then(res => {
    console.log('Bike deleted')
  })
  .catch(err => {
    console.error('Delete failed: ', err.message)
  })

  client.delete(docId)

  // Multiple mutations in a transaction
  const namePatch = client
  .patch('bike-310')
  .set({name: 'A Bike To Go'})

client
  .transaction()
  .create({name: 'Sanity Tandem Extraordinaire', seats: 2})
  .delete('bike-123')
  .patch(namePatch)
  .commit()
  .then(res => {
    console.log('Whole lot of stuff just happened')
  })
  .catch(err => {
    console.error('Transaction failed: ', err.message)
  })

  client.transaction().create(doc).delete(docId).patch(patch).commit()


  // Create a transaction to perform chained mutations.
  client
  .transaction()
  .create({name: 'Sanity Tandem Extraordinaire', seats: 2})
  .patch('bike-123', p => p.set({inStock: false}))
  .commit()
  .then(res => {
    console.log('Bike created and a different bike is updated')
  })
  .catch(err => {
    console.error('Transaction failed: ', err.message)
  })

 // client.asset.upload(type: 'file' | image', body: File | Blob | Buffer | NodeStream, options = {}): Promise<AssetDocument>

// Examples: Uploading assets from the Browser
// Draw something on a canvas and upload as image
const canvas = document.getElementById('someCanvas')
const ctx = canvas.getContext('2d')
ctx.fillStyle = '#f85040'
ctx.fillRect(0, 0, 50, 50)
ctx.fillStyle = '#fff'
ctx.font = '10px monospace'
ctx.fillText('Sanity', 8, 30)
canvas.toBlob(uploadImageBlob, 'image/png')

function uploadImageBlob(blob) {
  client.assets
    .upload('image', blob, {contentType: 'image/png', filename: 'someText.png'})
    .then(document => {
      console.log('The image was uploaded!', document)
    })
    .catch(error => {
      console.error('Upload failed:', error.message)
    })
}


// Examples: Specify image metadata to extract
// Extract palette of colors as well as GPS location from exif
client.assets
  .upload('image', someFile, {extract: ['palette', 'location']})
  .then(document => {
    console.log('The file was uploaded!', document)
  })
  .catch(error => {
    console.error('Upload failed:', error.message)
  })

  // Deleting an asset
  client.delete('image-abc123_someAssetId-500x500-png')
  .then(result => {
    console.log('deleted imageAsset', result)
  })

// Get client configuration
const config = client.config()
console.log(config.dataset)

client.config()

// Set client configuration
client.config({dataset: 'newDataset'})

client.config(options)
