1. Go to https://www.tcgplayer.com/search/grand-archive/product?productLineName=grand-archive&view=grid&ProductTypeName=Sealed+Product
2. Copy the `results` output of the POST request into the console as `temp0`
3. Run the code below:

```js
JSON.stringify(temp0.results[0].results.map(entry => ({
  name: entry.productUrlName,
  productId: entry.productId.parsedValue
})))
```

4. Copy the data into a local array
5. Go to the next page and repeat the same process until the array contains all values
6. Collate and sort everything using the code below:

```js
JSON.stringify([ ... ].sort((a, b) => a.productId - b.productId))
```