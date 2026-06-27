/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import { mapOrder } from '~/utils/sorts.js'

const app = express()

const hostname = 'localhost'
const port = 8017

app.get('/', (req, res) => {
  res.end('<h1>Hello World!</h1><hr>')
})

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Hello Trung Quan Dev, I am running at ${ hostname }:${ port }/`)
})
